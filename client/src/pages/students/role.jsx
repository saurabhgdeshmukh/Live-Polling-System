import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Role() {
  const [selected, setSelected] = useState("student");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selected) return;

    // Store role
    sessionStorage.setItem("role", selected);

    // If teacher, generate session ID if not already set
    if (selected === "teacher") {
      let sessionId = sessionStorage.getItem("teacherSessionId");
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem("teacherSessionId", sessionId);
      }
      navigate("/question-data");
    } else {
      navigate("/info");
    }
  };

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
            d="M12.8016 8.76363C12.8028 8.96965 ... [TRUNCATED SVG PATH] ..."
            fill="white"
          />
        </svg>
        <div className="ml-1 mt-0.5 font-semibold">Intervue Poll</div>
      </div>

      <h1 className="text-4.5xl md:text-4.5xl text-center mb-2">
        Welcome to the <strong className="font-semibold">Live Polling System</strong>
      </h1>

      <p className="text-[#6E6E6E] text-xl text-center mb-8 max-w-[800px]">
        Please select the role that best describes you to begin using the live polling system
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-10 w-full max-w-3xl">
        <div
          onClick={() => setSelected("student")}
          className={`rounded-lg p-[2.8px] w-full md:w-1/2 transition cursor-pointer ${
            selected === "student"
              ? "bg-gradient-to-r from-[#8F64E1] to-[#1D68BD]"
              : "bg-gray-200"
          }`}
        >
          <div className="bg-white p-5 rounded-lg h-[143px] text-left">
            <h3 className="font-semibold text-2xl mb-1">I’m a Student</h3>
            <p className="text-m text-[#6E6E6E] max-w-[387px]">
              Answer questions and view results after submitting your response.
            </p>
          </div>
        </div>

        <div
          onClick={() => setSelected("teacher")}
          className={`rounded-lg p-[2px] w-full md:w-1/2 transition cursor-pointer ${
            selected === "teacher"
              ? "bg-gradient-to-r from-[#8F64E1] to-[#1D68BD]"
              : "bg-gray-200"
          }`}
        >
          <div className="bg-white p-5 rounded-lg h-[143px] text-left">
            <h3 className="font-semibold text-2xl mb-1">I’m a Teacher</h3>
            <p className="text-m text-[#6E6E6E] max-w-[387px]">
              Create polls and monitor live student responses in real-time.
            </p>
          </div>
        </div>
      </div>

      <button
        disabled={!selected}
        onClick={handleContinue}
        className={`px-8 py-2 w-[233px] h-[57px] rounded-full text-white text-xl font-medium transition ${
          selected
            ? "bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] hover:opacity-90"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}

export default Role;
