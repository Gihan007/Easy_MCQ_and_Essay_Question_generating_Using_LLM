import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseInit";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaLock } from "react-icons/fa";

const McqPage = () => {
  const [file, setFile] = useState(null);
  const [mcqCount, setMcqCount] = useState(5);
  const [mcqs, setMcqs] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileTypeOk, setFileTypeOk] = useState(false);
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileTypeOk(true);
    } else {
      setFileTypeOk(false);
      alert("Please upload a PDF file.");
    }
  };

  const handleGenerateMCQs = async () => {
    if (!file || mcqCount <= 0) {
      alert("Please upload a file and enter a valid MCQ count.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mcq_count", mcqCount);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_mcqs", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setMcqs(data.mcqs);
      setSubmitted(false);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }

    /*const response = {
      mcqs: [
        {
          question: "What is the capital of France?",
          options: ["Berlin", "Madrid", "Paris", "Rome"],
          correct_answer: "Paris",
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Earth", "Mars", "Jupiter", "Venus"],
          correct_answer: "Mars",
        },
      ],
    };*/
  };

  const handleAnswerChange = (index, answer) => {
    setUserAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((mcq, index) => {
      if (userAnswers[index] === mcq.correct_answer) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <>
      <div className="p-6 sm:p-10 max-w-3xl mx-auto ">
        <h2 className="text-3xl font-bold text-center  text-blue-600 mb-6">
          MCQ Generator
        </h2>

        <div className="border border-gray-300 rounded-lg p-5 mb-6 shadow-md">
          <h3 className="text-lg font-semibold text-center mb-4">
            Upload a File
          </h3>

          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full px-4 py-2 text-sm text-gray-500 
         file:py-2 file:px-4
         file:rounded-lg file:border-0
         file:text-sm file:font-semibold
         file:bg-blue-50 file:text-blue-700
         hover:file:bg-blue-100 transition"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between mt-5">
            <h4 className="text-center text-lg font-semibold mb-2 sm:mb-0">
              MCQ Count
            </h4>

            <input
              type="number"
              value={mcqCount}
              max={userPlan === "Basic" ? 10 : 100}
              min={1}
              onChange={(e) => setMcqCount(e.target.value)}
              className="w-full sm:w-1/3 border text-white text-center border-gray-300 rounded-lg p-3 
           focus:ring-2 focus:ring-blue-500 focus:outline-none 
         text-lg transition"
            />
          </div>
          {userPlan === "Basic" ? (
            <p className="text-right mt-2 text-gray-500 text-sm">
              🔒 Maximum 10 mcq's for basic plan,
              <a
                className="text-blue-600 font-semibold"
                href="subscriptionForm"
              >
                {" "}
                Upgrade plan
              </a>
            </p>
          ) : null}

          <button
            onClick={handleGenerateMCQs}
            className={`mt-6 w-full ${
              loading || !fileTypeOk
                ? "bg-gray-800"
                : "bg-gradient-to-r from-blue-500 to-blue-700"
            } 
         text-white font-bold py-3 px-6 rounded-lg
         hover:bg-opacity-80 transition-all duration-300`}
            disabled={loading || !fileTypeOk}
          >
            {loading ? "Generating..." : "Generate MCQs"}
          </button>
        </div>

        {loading && (
          <div className="text-center mt-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              ></path>
            </svg>
            <p className="text-gray-600">Generating MCQs, please wait...</p>
          </div>
        )}
      </div>
      {mcqs.length > 0 && (
        <div className=" mb-10 w-3/4 mx-auto text-center border border-gray-300 rounded-lg p-6 bg-transparent shadow-lg transition-all duration-300">
          <h3 className="text-xl font-bold text-center m-10 text-white-800">
            Answer All the Questions
          </h3>

          {mcqs.map((mcq, index) => (
            <div key={index} className="mb-6 p-4 shadow-sm bg-black">
              <p className="mb-5 italic text-lg text-white">
                {index + 1}. {mcq.question}
              </p>
              <div className="m-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mcq.options.map((option) => (
                  <label
                    key={`${index}-${option}`}
                    className={`flex italic items-center text-left p-3 border border-gray-300 rounded-lg cursor-pointer transition 
            ${
              userAnswers[index] === option
                ? "bg-blue-700 text-white"
                : "bg-slate-950 hover:bg-blue-900"
            }`}
                  >
                    <input
                      type="radio"
                      name={`mcq-${index}`}
                      value={option}
                      onChange={() => handleAnswerChange(index, option)}
                      disabled={submitted}
                      className="hidden"
                    />
                    {option}
                  </label>
                ))}
              </div>
              {submitted && (
                <p
                  className={`mt-3 font-medium ${
                    userAnswers[index] === mcq.correct_answer
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {userAnswers[index] === mcq.correct_answer
                    ? "✅ Answer is correct"
                    : `❌ Correct Answer: ${mcq.correct_answer}`}
                </p>
              )}
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="mb-6 lg:w-1/2 md:w-3/4 sm:w-full bg-red-700 hover:bg-red-500 
             text-white font-bold py-3 px-6 rounded-lg shadow-md 
             transition-all duration-300"
            >
              Submit Answers
            </button>
          ) : (
            <p className="mt-6 font-bold text-xl text-center text-white-800">
              🎯 Score: {calculateScore()} / {mcqs.length}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default McqPage;
