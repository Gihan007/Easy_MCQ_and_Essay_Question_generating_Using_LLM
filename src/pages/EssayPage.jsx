import { useState } from "react";

const EssayPage = () => {
  const [topic, setTopic] = useState("");
  const [wordCount, setWordCount] = useState(50);
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateEssay = async () => {
    if (topic == "" || wordCount <= 0) {
      alert("Please enter topic and word count.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("word_count", wordCount);

    try {
      const response = await fetch("http://127.0.0.1:5001/generate_essay", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setEssay(data);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-6 sm:p-10 max-w-3xl mx-auto ">
        <h2 className="text-3xl font-bold text-center  text-blue-600 mb-6">
          Essay Generator
        </h2>

        <div className="border border-gray-300 rounded-lg p-5 mb-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between mt-5">
            <h4 className="text-center text-lg font-semibold mb-2 sm:mb-0">
              Topic
            </h4>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full sm:w-2/3 border text-white text-center border-gray-300 rounded-lg p-3 
                 focus:ring-2 focus:ring-blue-500 focus:outline-none 
             text-lg transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-5">
            <h4 className="text-center text-lg font-semibold mb-2 sm:mb-0">
              Word Count
            </h4>
            <input
              type="number"
              value={wordCount}
              min={50}
              max={2000}
              onChange={(e) => setWordCount(e.target.value)}
              className="w-full sm:w-1/3 border text-white text-center border-gray-300 rounded-lg p-3 
                 focus:ring-2 focus:ring-blue-500 focus:outline-none 
             text-lg transition"
            />
          </div>

          <button
            onClick={handleGenerateEssay}
            className={`mt-6 w-full ${
              loading
                ? "bg-gray-700"
                : "bg-gradient-to-r from-blue-500 to-blue-700"
            } 
             text-white font-bold py-3 px-6 rounded-lg
             hover:bg-opacity-80 transition-all duration-300`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Essay"}
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
            <p className="text-gray-600">Generating Essay, please wait...</p>
          </div>
        )}
      </div>
      {essay.length > 0 && (
        <div className="w-3/4 mx-auto text-center border border-gray-300 rounded-lg p-6 bg-transparent shadow-lg transition-all duration-300">
          <h3 className="mt-5 text-xl font-bold text-center text-white-800 underline">
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </h3>
          <p className="p-10 text-justify"> {essay}</p>
        </div>
      )}
    </>
  );
};

export default EssayPage;
