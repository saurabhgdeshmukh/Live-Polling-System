import React, { useEffect, useState } from "react";
import ChatPopup from "./ChatPopup";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io("http://localhost:4000");

const QuestionCard = () => {
  const navigate=useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [questionData, setQuestionData] = useState(null);
  const [results, setResults] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [role, setRole] = useState("student");
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
  const handleClick=()=>{
              navigate("/question-data")
            }
  useEffect(() => {
  const fetchLatestQuestion = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/questions/latest");
      const data = await res.json();
      console.log("📦 Fetched from /latest:", data);

      if (data) {
        setQuestionData(data);
        setTimeLeft(data.duration || 60);
      }
    } catch (err) {
      console.error("Failed to fetch latest question", err);
    }
  };

  fetchLatestQuestion();

  socket.on("question:active", (data) => {
    console.log("📨 Received question:active", data);
    setQuestionData(data);
    setSelected(null);
    setSubmitted(false);
    setResults([]);
    setTimeLeft(data.duration || 60);
  });

  socket.on("question:results", (data) => {
    setResults(data);
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
  const total = results.reduce((sum, r) => sum + Number(r.count), 0);
  const option = results.find((r) => r.optionId === optionId || r.option_id === optionId);
  const count = Number(option?.count || 0);
  return total === 0 ? 0 : Math.round((count / total) * 100);
};



  if (!questionData && role === "student") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 font-sora">
        <div className="w-[134px] h-[31px] flex text-sm text-white bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] px-3 py-1 rounded-full mb-6">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-center mt-1"
          >
            <path
              d="M12.8016 8.76363C12.8028 8.96965 12.7402 9.17098 12.6223 9.33992C12.5044 9.50887 12.337 9.63711 12.1432 9.707L8.88111 10.907L7.68107 14.1671C7.6101 14.3604 7.48153 14.5272 7.31274 14.645C7.14394 14.7628 6.94305 14.826 6.7372 14.826C6.53135 14.826 6.33045 14.7628 6.16166 14.645C5.99286 14.5272 5.8643 14.3604 5.79333 14.1671L4.59076 10.9111L1.33017 9.71104C1.13711 9.63997 0.970488 9.5114 0.852794 9.34266C0.735101 9.17392 0.671997 8.97315 0.671997 8.76742C0.671997 8.56169 0.735101 8.36092 0.852794 8.19218C0.970488 8.02345 1.13711 7.89487 1.33017 7.82381L4.59227 6.62376L5.79232 3.36418C5.86339 3.17112 5.99196 3.0045 6.1607 2.88681C6.32943 2.76911 6.53021 2.70601 6.73593 2.70601C6.94166 2.70601 7.14244 2.76911 7.31117 2.88681C7.47991 3.0045 7.60848 3.17112 7.67955 3.36418L8.8796 6.62629L12.1392 7.82633C12.3328 7.8952 12.5003 8.02223 12.6189 8.19003C12.7375 8.35782 12.8013 8.55817 12.8016 8.76363ZM9.26462 2.70024H10.2752V3.71081C10.2752 3.84482 10.3284 3.97334 10.4232 4.06809C10.5179 4.16285 10.6465 4.21609 10.7805 4.21609C10.9145 4.21609 11.043 4.16285 11.1378 4.06809C11.2325 3.97334 11.2858 3.84482 11.2858 3.71081V2.70024H12.2963C12.4303 2.70024 12.5588 2.64701 12.6536 2.55225C12.7484 2.45749 12.8016 2.32897 12.8016 2.19496C12.8016 2.06095 12.7484 1.93243 12.6536 1.83767C12.5588 1.74291 12.4303 1.68968 12.2963 1.68968H11.2858V0.679111C11.2858 0.545101 11.2325 0.416581 11.1378 0.321822C11.043 0.227063 10.9145 0.173828 10.7805 0.173828C10.6465 0.173828 10.5179 0.227063 10.4232 0.321822C10.3284 0.416581 10.2752 0.545101 10.2752 0.679111V1.68968H9.26462C9.13061 1.68968 9.00209 1.74291 8.90733 1.83767C8.81257 1.93243 8.75934 2.06095 8.75934 2.19496C8.75934 2.32897 8.81257 2.45749 8.90733 2.55225C9.00209 2.64701 9.13061 2.70024 9.26462 2.70024ZM14.8227 4.72137H14.3174V4.21609C14.3174 4.08208 14.2642 3.95356 14.1695 3.8588C14.0747 3.76404 13.9462 3.71081 13.8122 3.71081C13.6782 3.71081 13.5496 3.76404 13.4549 3.8588C13.3601 3.95356 13.3069 4.08208 13.3069 4.21609V4.72137H12.8016C12.6676 4.72137 12.5391 4.77461 12.4443 4.86937C12.3496 4.96412 12.2963 5.09264 12.2963 5.22665C12.2963 5.36066 12.3496 5.48918 12.4443 5.58394C12.5391 5.6787 12.6676 5.73194 12.8016 5.73194H13.3069V6.23722C13.3069 6.37123 13.3601 6.49975 13.4549 6.59451C13.5496 6.68927 13.6782 6.7425 13.8122 6.7425C13.9462 6.7425 14.0747 6.68927 14.1695 6.59451C14.2642 6.49975 14.3174 6.37123 14.3174 6.23722V5.73194H14.8227C14.9567 5.73194 15.0853 5.6787 15.18 5.58394C15.2748 5.48918 15.328 5.36066 15.328 5.22665C15.328 5.09264 15.2748 4.96412 15.18 4.86937C15.0853 4.77461 14.9567 4.72137 14.8227 4.72137Z"
              fill="white"
            />
          </svg>
          <div className="ml-1 mt-0.5 font-semibold">Intervue Poll</div>
        </div>
        <div className="my-6">
          <div className="p-2 w-14 h-14 border-[6px] border-[#4D0ACD] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-4xl md:text-4xl   text-center mb-2">
          <strong className="font-semibold">
            Wait for the teacher to ask questions..
          </strong>
        </h1>
      </div>
    );
  }
  if (!questionData) return null; // Or your loader/wait screen



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
              onClick={() =>
                role === "student" && !submitted && setSelected(option._id)
              }
              className={`relative mt-4 px-4 py-3 m-2 rounded-lg border transition-all cursor-${
                role === "student" && !submitted ? "pointer" : "default"
              } ${
                selected === option._id
                  ? "border-purple-600 bg-purple-50"
                  : "border-transparent bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center z-10 relative">
                <span className="font-medium text-sm">{option.text}</span>
                {showResults && (
                  <span className="text-xs font-semibold text-gray-600">
                    {percentage}%
                  </span>
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
      {role === "teacher" && (
        <div className="w-full flex justify-end mt-6">
          <button
            onClick={handleClick}
            className={`px-8 py-2 w-[306px] h-[57px] rounded-full text-white text-xl font-medium transition bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] 
              "hover:opacity-90" 
            }`}
          >
            + Ask a new question
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
