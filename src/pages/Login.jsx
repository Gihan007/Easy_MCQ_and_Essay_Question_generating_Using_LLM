import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../components/Header";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseInit";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const db = getFirestore();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate("/");
      console.log("User Info:", result.user);
      // Check if user already exists in Firestore
      const userRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // New user, set default plan
        await setDoc(userRef, {
          name: result.user.displayName,
          email: result.user.email,
          plan: "Basic",
          subscriptionStart: new Date(),
        });
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-[#1A1A32]">
      <Header />
      <div className="w-full max-w-md bg-sky-100 opacity-90 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full  text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10 bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-4 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end ">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2 "
            />
            <label className="text-gray-700">Remember Me</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-black m-5">OR</p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Sign in with Google
        </button>
        <div className="text-center mt-4 text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <a href="register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
          <p>
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
