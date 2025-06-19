import React, { useEffect, useState } from "react";
import ChatPopup from "./ChatPopup";
import io from "socket.io-client";
const socket = io("http://localhost:4000");

const QuestionCard = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [questionData, setQuestionData] = useState(null);
  const [results, setResults] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [role, setRole] = useState("student"); // default fallback


  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
    let stored = sessionStorage.getItem("studentName");
    if (!stored) {
      stored = "User-" + Math.floor(Math.random() * 10000);
      sessionStorage.setItem("studentName", stored);
    }
    setCurrentUser(stored);
  }, []);

  useEffect(() => {
    // Listen to new question from server
    socket.on("question:active", (data) => {
      console.log("📨 Received question:active", data);
      setQuestionData(data);
      setSelected(null);
      setSubmitted(false);
      setResults([]);
      setTimeLeft(data.duration || 60);
    });

    // Listen for updated results (teacher view or after submit)
    socket.on("question:results", (data) => {
      setResults(data); // Array of percentages
    });

    return () => {
      socket.off("question:active");
      socket.off("question:results");
    };
  }, []);

  // Timer
  useEffect(() => {
    if (submitted || role === "teacher") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, role]);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    socket.emit("question:submit_answer", {
      questionId: questionData._id,
      user: currentUser,
      answerId: selected,
    });
    setSubmitted(true);
  };

  const calculatePercentage = (optionId) => {
    const total = results.reduce((sum, r) => sum + r.count, 0);
    const option = results.find((r) => r.optionId === optionId);
    return total === 0 ? 0 : Math.round((option?.count / total) * 100);
  };

  // if (!questionData) {
  //   return (
  //     <div className="text-center font-sora mt-20">
  //       <p className="text-xl text-gray-600">Waiting for the teacher to ask a new question...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="relative font-sora flex flex-col items-start justify-center mx-auto mt-40 w-[727px]">
      <div className="flex items-center mb-4 gap-4">
        <p className="text-xl font-semibold">Question</p>
        {role !== "teacher" && (
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <span>⏱️</span>
            <span>{`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}</span>
          </div>
        )}
      </div>

      <div className="w-full text-left rounded-t-lg bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white px-4 py-2 font-semibold">
        {questionData.question}
      </div>

      <div className="w-full border border-purple-500 rounded-b-lg py-2 px-4">
        {questionData.options.map((option) => {
          const percentage = calculatePercentage(option._id);
          const showResults = submitted || role === "teacher";

          return (
            <div
              key={option._id}
              onClick={() => !submitted && setSelected(option._id)}
              className={`relative mt-4 px-4 py-3 m-2 rounded-lg cursor-pointer border transition-all ${
                selected === option._id ? "border-purple-600 bg-purple-50" : "border-transparent bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center z-10 relative">
                <span className="font-medium text-sm">{option.text}</span>
                {showResults && (
                  <span className="text-xs font-semibold text-gray-600">{percentage}%</span>
                )}
              </div>

              {showResults && (
                <div
                  className="absolute left-0 top-0 h-full bg-[#8F64E1] rounded-lg z-0 transition-all"
                  style={{ width: `${percentage}%`, opacity: 0.2 }}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {role === "student" && (
        <div className="w-full flex justify-end mt-6">
          <button
            disabled={!selected || submitted}
            onClick={handleSubmit}
            className={`px-8 py-2 w-[233px] h-[57px] rounded-full text-white text-xl font-medium transition bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] ${
              selected && !submitted ? "hover:opacity-90" : "cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      )}

      <div className="fixed bottom-12 right-10 z-50">
        <button
          onClick={() => setChatOpen((prev) => !prev)}
          className="w-12 h-12 rounded-full bg-[#6366F1] flex items-center justify-center shadow-lg"
        >
          💬
        </button>
      </div>

      <ChatPopup
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
};

export default QuestionCard;
