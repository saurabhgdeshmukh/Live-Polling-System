import React, { useEffect, useState } from "react";

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
    <div className="p-8 font-sora bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">
        View <span className="text-purple-600">Poll History</span>
      </h1>

      {history.map((item, index) => (
        <div key={item._id || index} className="mb-10 w-full max-w-2xl mx-auto">
          <div className="mb-2 font-medium text-lg">Question {index + 1}</div>

          <div className="rounded-t-lg bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white px-4 py-2 font-semibold">
            {item.question}
          </div>

          <div className="border border-purple-500 rounded-b-lg py-2 px-4 bg-white">
            {item.options.map((option) => {
              const percentage = calculatePercentage(option._id, item.results);

              return (
                <div
                  key={option._id}
                  className="relative mt-4 px-4 py-3 m-2 rounded-lg bg-gray-100 border border-transparent"
                >
                  <div className="flex justify-between items-center z-10 relative">
                    <span className="font-medium text-sm">{option.text}</span>
                    <span className="text-xs font-semibold text-gray-600">
                      {percentage}%
                    </span>
                  </div>

                  <div
                    className="absolute left-0 top-0 h-full bg-[#8F64E1] rounded-lg z-0 transition-all"
                    style={{ width: `${percentage}%`, opacity: 0.3 }}
                  ></div>
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
