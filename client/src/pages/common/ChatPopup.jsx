import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://live-polling-system-1-zunt.onrender.com");

const ChatPopup = ({ isOpen, onClose, currentUser, role }) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [participants, setParticipants] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat:receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("users:update", (list) => {
      setParticipants(list);
    });

    socket.on("user:kicked", ({ name }) => {
      if (name === currentUser) {
        alert("You have been kicked out.");
        sessionStorage.clear();
        window.location.href = "/";
      }
    });

    return () => {
      socket.off("chat:receive_message");
      socket.off("users:update");
      socket.off("user:kicked");
    };
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send chat message
  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const message = { sender: currentUser, message: newMsg };
    socket.emit("chat:send_message", message);
    setNewMsg("");
  };

  const kickParticipant = (userId) => {
    socket.emit("user:kick", { id: userId });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-28 right-14 w-[400px] h-[477px] bg-white shadow-lg z-50 border border-gray-300 flex flex-col
        animate-slide-in transition-all duration-300">
      <div className="flex border-b w-full">
        {["Chat", "Participants"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${
              activeTab === tab.toLowerCase()
                ? "border-[#8F64E1] text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 h-full overflow-y-auto flex-1">
        {activeTab === "chat" ? (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm ${
                  msg.sender === currentUser ? "text-right" : "text-left"
                } text-gray-900`}
              >
                <div className="text-xs text-[#4F0BD3] font-semibold mb-1">
                  {msg.sender}
                </div>
                <div
                  className={`inline-block px-3 py-2 text-white max-w-[75%] break-words
    ${
      msg.sender === currentUser
        ? "bg-[#3A3A3B] rounded-tl-lg rounded-bl-lg rounded-br-lg ml-auto"
        : "bg-[#8F64E1] rounded-tr-lg rounded-br-lg rounded-bl-lg"
    }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        ) : (
          <div>
            <div className="text-left text-[#726F6F] mb-2 grid grid-cols-2 font-semibold text-sm border-b pb-2">
              <span>Name</span>
              {role === "teacher" && <span className="text-right">Action</span>}
            </div>

            <ul className="text-sm text-left text-gray-800 space-y-3">
              {participants.map((user) => (
                <li key={user.id} className="flex justify-between items-center">
                  <span>{user.name}</span>
                  {role === "teacher" ? (
                    <button
                      onClick={() => kickParticipant(user.id)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Kick out
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400"></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {activeTab === "chat" && (
        <div className="border-t p-3 flex items-center">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="ml-2 text-white bg-[#8F64E1] hover:opacity-90 px-4 py-2 rounded-full text-sm"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
