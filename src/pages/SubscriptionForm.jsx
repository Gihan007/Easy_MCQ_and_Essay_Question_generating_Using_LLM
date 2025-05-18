import { useState } from "react";
import Header from "../components/Header";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseInit";

const SubscriptionForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: "ItemNo12345",
          amount: "10.00",
          currency: "USD",
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          address: address,
          city: city,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment session");
      }

      const payment = await response.json();

      payhere.startPayment(payment);
      payhere.onCompleted = async function onCompleted(orderId) {
        console.log("Payment completed. Payment id:" + orderId);

        fetchUserData("Premium", orderId);
        // Note: validate the payment and show success or failure page to the customer
      };

      // Payment window closed
      payhere.onDismissed = function onDismissed() {
        // Note: Prompt user to pay again or show an error page
        console.log("Payment dismissed");
      };

      // Error occurred
      payhere.onError = function onError(error) {
        // Note: show an error page
        console.log("Error:" + error);
      };
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const fetchUserData = async (plan, paymentId) => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setDoc(
          userRef,
          { plan: plan, subscriptionStart: new Date(), paymentID: paymentId },
          { merge: true }
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-[#1A1A32]">
      <Header />
      <div className="w-full max-w-lg mt-24 mx-5 bg-sky-100 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Enter Details
        </h2>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="flex flex-row">
            <label className="w-1/3 my-auto text-gray-700 font-medium">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full  text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
              required
            />
          </div>
          <div className="flex flex-row">
            <label className="w-1/3 my-auto text-gray-700 font-medium">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full  text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
              required
            />
          </div>
          <div className="flex flex-row">
            <label className="w-1/3 my-auto text-gray-700 font-medium">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full  text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
              required
            />
          </div>
          <div className="flex flex-row">
            <label className="w-1/3 my-auto text-gray-700 font-medium">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full  text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
              required
            />
          </div>

          <div className="flex flex-row">
            <label className="w-1/3 my-auto text-gray-700 font-medium">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500  bg-white outline-none"
              required
            />
          </div>
          <div className="flex flex-row">
            <label className="w-1/3 my-auto text-gray-700 font-medium">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full  text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500  bg-white outline-none"
              required
            />
          </div>
          <div className="flex flex-row">
            <label className="w-1/3 my-auto text-gray-700 font-medium">
              Amount
            </label>
            <input
              type="text"
              value={"$ 10.00"}
              readOnly
              className="w-full  text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500  bg-gray-200 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
          >
            Subscribe
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          <p>
            Continue with free plan?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
              className="text-blue-600 hover:underline"
            >
              back to previous page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
