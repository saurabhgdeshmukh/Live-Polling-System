import React, { useState } from "react";

const ChatPopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("chat");

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-28 right-14 w-[400px] h-[477px] bg-white shadow-lg z-50 border border-gray-300">
      <div className="flex border-b w-[250px]">
        {["Chat", "Participants"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${
              activeTab === tab.toLowerCase()
                ? "border-[#8F64E1] text-[black]"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 h-[300px] overflow-y-auto">
        {activeTab === "chat" ? (
          <div className="space-y-4">
            <div className="text-sm text-left text-gray-900">
              <div className="text-xs text-[#4F0BD3] font-semibold mb-1">User 1</div>
              <div className="inline-block bg-[#3A3A3B] text-white px-3 py-2 rounded-md">
                Hey There , how can I help?
              </div>
            </div>
            <div className="text-sm text-gray-900 text-right">
              <div className="text-xs text-[#4F0BD3] font-semibold mb-1">User 2</div>
              <div className="inline-block bg-[#8F64E1] text-white px-3 py-2 rounded-md">
                Nothing bro..just chill!!!
              </div>
            </div>
          </div>
        ) : (
        <div>
            <div className="text-left text-[#726F6F] mb-2">Name</div>
          <ul className="text-sm text-left text-gray-800 space-y-4">
            {[
              "Rahul Arora",
              "Pushpender Rautela",
              "Rijul Zalpuri",
              "Nadeem N",
              "Ashwin Sharma",
            ].map((name, index) => (
              <li key={index} className="font-medium">
                {name}
              </li>
            ))}
          </ul>
        </div>
        )}
      </div>
    </div>
  );
};

export default ChatPopup;
