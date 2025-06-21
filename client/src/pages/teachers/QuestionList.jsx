import { useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("https://live-polling-system-1-zunt.onrender.com");
function QuestionList() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([
    { text: "", correct: null },
    { text: "", correct: null },
  ]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);
  };

  const handleCorrectChange = (index, value) => {
    const updated = [...options];
    updated[index].correct = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, { text: "", correct: null }]);
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || options.some((o) => !o.text.trim())) {
      alert("Please fill the question and all option texts.");
      return;
    }

    const sessionId = sessionStorage.getItem("teacherSessionId");
    if (!sessionId) {
      alert(
        "Session ID is missing. Please go back and select your role again."
      );
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/questions", {
        question,
        duration,
        options,
        sessionId,
        created_at: new Date().toISOString(),
      });

      socket.emit("question:active", res.data); // still emits

      // Optional cleanup (uncomment if desired)
      setQuestion("");
      setOptions([
        { text: "", correct: null },
        { text: "", correct: null },
      ]);

      navigate("/question");
    } catch (error) {
      console.error("❗ Failed to submit question:", error);
      alert("Failed to submit question.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-8 font-sora">
       <div className="w-[134px] h-[31px] flex text-sm text-white bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] px-3 py-1 rounded-full mb-6">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-center mt-1"
        >
          <path   d="M12.8016 8.76363C12.8028 8.96965 12.7402 9.17098 12.6223 9.33992C12.5044 9.50887 12.337 9.63711 12.1432 9.707L8.88111 10.907L7.68107 14.1671C7.6101 14.3604 7.48153 14.5272 7.31274 14.645C7.14394 14.7628 6.94305 14.826 6.7372 14.826C6.53135 14.826 6.33045 14.7628 6.16166 14.645C5.99286 14.5272 5.8643 14.3604 5.79333 14.1671L4.59076 10.9111L1.33017 9.71104C1.13711 9.63997 0.970488 9.5114 0.852794 9.34266C0.735101 9.17392 0.671997 8.97315 0.671997 8.76742C0.671997 8.56169 0.735101 8.36092 0.852794 8.19218C0.970488 8.02345 1.13711 7.89487 1.33017 7.82381L4.59227 6.62376L5.79232 3.36418C5.86339 3.17112 5.99196 3.0045 6.1607 2.88681C6.32943 2.76911 6.53021 2.70601 6.73593 2.70601C6.94166 2.70601 7.14244 2.76911 7.31117 2.88681C7.47991 3.0045 7.60848 3.17112 7.67955 3.36418L8.8796 6.62629L12.1392 7.82633C12.3328 7.8952 12.5003 8.02223 12.6189 8.19003C12.7375 8.35782 12.8013 8.55817 12.8016 8.76363ZM9.26462 2.70024H10.2752V3.71081C10.2752 3.84482 10.3284 3.97334 10.4232 4.06809C10.5179 4.16285 10.6465 4.21609 10.7805 4.21609C10.9145 4.21609 11.043 4.16285 11.1378 4.06809C11.2325 3.97334 11.2858 3.84482 11.2858 3.71081V2.70024H12.2963C12.4303 2.70024 12.5588 2.64701 12.6536 2.55225C12.7484 2.45749 12.8016 2.32897 12.8016 2.19496C12.8016 2.06095 12.7484 1.93243 12.6536 1.83767C12.5588 1.74291 12.4303 1.68968 12.2963 1.68968H11.2858V0.679111C11.2858 0.545101 11.2325 0.416581 11.1378 0.321822C11.043 0.227063 10.9145 0.173828 10.7805 0.173828C10.6465 0.173828 10.5179 0.227063 10.4232 0.321822C10.3284 0.416581 10.2752 0.545101 10.2752 0.679111V1.68968H9.26462C9.13061 1.68968 9.00209 1.74291 8.90733 1.83767C8.81257 1.93243 8.75934 2.06095 8.75934 2.19496C8.75934 2.32897 8.81257 2.45749 8.90733 2.55225C9.00209 2.64701 9.13061 2.70024 9.26462 2.70024ZM14.8227 4.72137H14.3174V4.21609C14.3174 4.08208 14.2642 3.95356 14.1695 3.8588C14.0747 3.76404 13.9462 3.71081 13.8122 3.71081C13.6782 3.71081 13.5496 3.76404 13.4549 3.8588C13.3601 3.95356 13.3069 4.08208 13.3069 4.21609V4.72137H12.8016C12.6676 4.72137 12.5391 4.77461 12.4443 4.86937C12.3496 4.96412 12.2963 5.09264 12.2963 5.22665C12.2963 5.36066 12.3496 5.48918 12.4443 5.58394C12.5391 5.6787 12.6676 5.73194 12.8016 5.73194H13.3069V6.23722C13.3069 6.37123 13.3601 6.49975 13.4549 6.59451C13.5496 6.68927 13.6782 6.7425 13.8122 6.7425C13.9462 6.7425 14.0747 6.68927 14.1695 6.59451C14.2642 6.49975 14.3174 6.37123 14.3174 6.23722V5.73194H14.8227C14.9567 5.73194 15.0853 5.6787 15.18 5.58394C15.2748 5.48918 15.328 5.36066 15.328 5.22665C15.328 5.09264 15.2748 4.96412 15.18 4.86937C15.0853 4.77461 14.9567 4.72137 14.8227 4.72137Z" fill="white" />
        </svg>
        <div className="ml-1 mt-0.5 font-semibold">Intervue Poll</div>
      </div>

      <div className="w-full max-w-3xl text-left mb-2">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Let's <strong className="font-bold">Get Started</strong>
        </h1>
      </div>

      <p className="text-[#6E6E6E] text-md md:text-lg text-left mb-8 max-w-3xl">
        you’ll have the ability to create and manage polls, ask questions, and
        monitor your students' responses in real-time.
      </p>

      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="text-left text-lg font-medium text-gray-700">
            Enter your question
          </label>
          <select
            className="text-sm rounded px-2 py-2 bg-[#F2F2F2]"
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={60}>60 seconds</option>
            <option value={45}>45 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={15}>15 seconds</option>
          </select>
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          maxLength={100}
          className="w-full bg-[#F2F2F2] h-40 px-3 py-2 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-[#4D0ACD]"
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {question.length}/100
        </div>
      </div>

      <div className="w-full max-w-3xl mb-8">
        <div className="flex font-medium text-sm text-gray-700 mb-2">
          <span>Edit Options</span>
          <span className="ml-[440px]">Is it Correct?</span>
        </div>
        {options.map((option, index) => (
  <div
    key={index}
    className="flex items-center justify-start mb-3 gap-2"
  >
    <div className="flex items-center w-[500px] h-[60px] gap-2">
      <span className="w-6 h-6 bg-[#8F64E1] rounded-full text-white flex items-center justify-center text-sm">
        {index + 1}
      </span>
      <input
        type="text"
        value={option.text}
        onChange={(e) => handleOptionChange(index, e.target.value)}
        className="flex-1 bg-[#F2F2F2] py-2 px-3 focus:outline-none"
      />
    </div>

    <div className="flex text-left ml-4 gap-4">
      {/* YES radio */}
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="radio"
          name={`correct-${index}`}
          checked={option.correct === true}
          onChange={() => handleCorrectChange(index, true)}
          className="hidden peer"
        />
        <div className={`w-5 h-5 rounded-full transition-all ${
          option.correct === true
            ? "border-4 border-white bg-[#8F64E1] ring-2 ring-[#8F64E1]"
            : "border-2 border-gray-400"
        }`} />
        <span>Yes</span>
      </label>

      {/* NO radio */}
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="radio"
          name={`correct-${index}`}
          checked={option.correct === false}
          onChange={() => handleCorrectChange(index, false)}
          className="hidden peer"
        />
        <div className={`w-5 h-5 rounded-full transition-all ${
          option.correct === false
            ? "border-4 border-white bg-[#8F64E1] ring-2 ring-[#8F64E1]"
            : "border-2 border-gray-400"
        }`} />
        <span>No</span>
      </label>
    </div>
  </div>
))}

        <div className="text-left">
          <button
            onClick={addOption}
            className="text-[#7451B6] text-sm border border-[#7451B6] rounded-lg p-2 font-medium mt-2"
          >
            + Add More option
          </button>
        </div>
        <hr className="border-[#B6B6B6] w-full my-6" />
      </div>

      <div className="w-full max-w-3xl flex justify-end mt-5">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-full text-white text-lg font-semibold bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] hover:opacity-90"
        >
          Ask Question
        </button>
      </div>
    </div>
  );
}

export default QuestionList;
