import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/firebaseInit";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { check } from "../assets";
import { pricing } from "../constants";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const PricingList = () => {
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState(null);

  useEffect(() => {
    const fetchUserPlan = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserPlan(userSnap.data().plan);
        }
      }
    });

    return () => fetchUserPlan();
  }, []);
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
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
  const handleSubscription = () => {
    if (auth.currentUser) {
      navigate("/subscriptionForm");
    } else {
      handleGoogleSignIn();
    }
  };
  return (
    <div className="flex gap-[1rem] max-lg:flex-wrap">
      {pricing.map((item) => (
        <div
          key={item.id}
          className="w-[19rem] max-lg:w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
          <h4 className="h4 mb-4">{item.title}</h4>

          <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
            {item.description}
          </p>

          <div className="flex items-center h-[5.5rem] mb-6">
            {item.price && (
              <>
                <div className="h3">$</div>
                <div className="text-[5.5rem] leading-none font-bold">
                  {item.price}
                </div>
              </>
            )}
          </div>
          {userPlan === item.title ? (
            <Button className="w-full mb-6" disabled={true}>
              Current Plan
            </Button>
          ) : (
            <Button
              className="w-full mb-6"
              onClick={item.price ? handleSubscription : null}
              white
            >
              {item.price ? "Get started" : "Contact us"}
            </Button>
          )}

          <ul>
            {item.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start py-5 border-t border-n-6"
              >
                <img src={check} width={24} height={24} alt="Check" />
                <p className="body-2 ml-4">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PricingList;
