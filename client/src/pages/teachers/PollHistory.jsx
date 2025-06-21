import React, { useEffect, useState } from "react";
import ChatPopup from "../common/ChatPopup";
const PollHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const sessionId = sessionStorage.getItem("teacherSessionId");
        const res = await fetch(
          `http://localhost:4000/api/history?sessionId=${sessionId}`
        );
        const data = await res.json();
        console.log("what is happenng",data)
        setHistory(data); // expect: [{ question, options: [...], results: [...] }]
      } catch (err) {
        console.error("Failed to fetch poll history", err);
      }
    };

    fetchHistory();
  }, []);

  const calculatePercentage = (optionId, results) => {
    const total = results.reduce((sum, r) => sum + Number(r.count), 0);
    const option = results.find(
      (r) => r.optionId === optionId || r.option_id === optionId
    );
    const count = Number(option?.count || 0);
    return total === 0 ? 0 : Math.round((count / total) * 100);
  };
  return (
    <div className="p-8 font-sora text-left min-h-screen">
      <h1 className="text-3xl text-left ml-[55px]  mb-8">
        View <strong >Poll History</strong>
      </h1>

      {history.map((item, index) => (
        <div key={item._id || index} className="mb-10 w-full max-w-2xl mx-auto">
          <div className="mb-2 font-medium text-lg">Question {index + 1}</div>

          <div className="rounded-t-lg bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white px-4 py-2 font-semibold">
            {item.question}
          </div>

          <div className="border border-purple-500 rounded-b-lg py-2 px-4 bg-white">
            {item.options.map((option, optIdx) => {
  const percentage = calculatePercentage(option._id, item.results);
  const onBar = percentage > 0;
  const optionLabel = optIdx + 1;

  return (
    <div
      key={option._id}
      className="relative mt-4 px-4 py-3 rounded-lg border overflow-hidden transition-all"
    >
      {/* Purple Result Bar */}
      <div
        className="absolute top-0 left-0 h-full bg-[#6766D5] z-0 transition-all"
        style={{ width: `${percentage}%`, opacity: 0.9 }}
      ></div>

      {/* Foreground content */}
      <div className="flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          {/* Numbered Circle */}
          <div
              className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-semibold ${
                onBar
                  ? "bg-white text-[#6766D5] "
                  : "bg-[#8D8D8D] text-white "
              }`}
            >
              {optionLabel}
            </div>
          {/* Option Text */}
          <span
            className={`text-sm font-medium z-10 ${
              onBar ? "text-white" : "text-gray-800"
            }`}
          >
            {option.text}
          </span>
        </div>

        {/* Percentage */}
        <span
          className={`text-sm font-semibold z-10 ${
            onBar ? "text-white" : "text-gray-800"
          }`}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
})}

          </div>
        </div>
      ))}
    </div>
  );
};

export default PollHistory;
