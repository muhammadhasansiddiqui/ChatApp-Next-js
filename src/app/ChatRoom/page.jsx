"use client";

import React, { useState, useEffect } from "react";
import { MdSend, MdVideoCall, MdCall } from "react-icons/md";
import { FaRegSmile } from "react-icons/fa";
import { auth } from "../../utils/firebase"; 
import useMessages from "../../utils/useMessages"; // Importing the real-time messages hook
import sendMessage from "../../utils/sendMessage"; // Importing the send message function

function ChatUIComponent() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const messages = useMessages(); // Fetch real-time messages

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (message.trim() && user) {
      await sendMessage(message, user);
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div className="flex h-screen w-full flex-col mx-auto border border-gray-700 bg-black text-white shadow-lg">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-700 bg-[#111111]">
        <div className="flex items-center">
          <img
            src={user?.photoURL || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww"}
            alt="Avatar"
            className="w-10 h-10 object-cover rounded-full"
          />
          <span className="ml-2 font-semibold">
            {user?.displayName || user?.email?.split("@")[0] || "User"}
          </span>
        </div>
        <div className="flex items-center text-gray-400">
          <MdCall size={20} className="text-lg mr-3 cursor-pointer hover:text-white" />
          <MdVideoCall size={24} className="text-lg mr-3 cursor-pointer hover:text-white" />
          <FaRegSmile size={20} className="text-lg cursor-pointer hover:text-white" />
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(({ id, text, senderId, sender, timestamp }) => (
          <div key={id} className={`flex ${senderId === user?.uid ? "justify-end" : ""}`}>
            <div className={`p-3 rounded-lg max-w-xs text-sm ${senderId !== user?.uid ? "bg-gray-800 text-gray-200" : "bg-green-700 text-white"} mb-4 shadow-md`}>
              <p>{text}</p>
              <small className="block text-right text-xs text-gray-400">{new Date(timestamp?.seconds * 1000).toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 flex items-center bg-[#111111] border-t border-gray-700">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white rounded-lg flex items-center justify-center hover:from-[#ff4b2b] hover:to-[#ff416c] transition"
        >
          <MdSend />
        </button>
      </div>
    </div>
  );
}

export default ChatUIComponent;
