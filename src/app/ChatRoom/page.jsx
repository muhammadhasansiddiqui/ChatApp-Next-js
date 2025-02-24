"use client";

import { MdSend, MdVideoCall, MdCall } from "react-icons/md";
import React, { useState, useEffect, useRef } from "react";
import useMessages from "../../utils/useMessages";
import sendMessage from "../../utils/sendMessage";
import { FaRegSmile } from "react-icons/fa";
import { IoArrowDown } from "react-icons/io5";
import { auth } from "../../utils/firebase";
import SidebarComponent from "../components/SidebarComponent"; 

function GroupChatComponent() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const messages = useMessages();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setIsScrolledUp(scrollHeight - (scrollTop + clientHeight) > 100);
    }
  };

  const handleSend = async () => {
    if (message.trim() && user) {
      const currentMessage = message;
      setMessage("");
      await sendMessage(currentMessage, user);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      {/* <SidebarComponent /> */}

      {/* Chat Section */}
      <div className="flex flex-col flex-1 mx-auto border border-gray-700 bg-black text-white shadow-lg">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-gray-700 bg-[#111111]">
          <h2 className="text-lg font-bold">Group Chat</h2>
          <div className="flex items-center text-gray-400">
            <MdCall size={20} className="text-lg mr-3 cursor-pointer hover:text-white" />
            <MdVideoCall size={24} className="text-lg mr-3 cursor-pointer hover:text-white" />
            <FaRegSmile size={20} className="text-lg cursor-pointer hover:text-white" />
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 relative" ref={chatContainerRef} onScroll={handleScroll}>
          {messages.map(({ id, text, senderId, sender, senderEmail, senderPhoto, timestamp }) => {
            const userImage =
              senderId === user?.uid
                ? user?.photoURL
                : senderPhoto && senderPhoto !== "undefined"
                ? senderPhoto
                : senderEmail && senderEmail.includes("@gmail.com") && user?.photoURL
                ? user.photoURL
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(sender || senderEmail?.split("@")[0] || "User")}&background=random&color=fff`;

            return (
              <div key={id} className={`flex ${senderId === user?.uid ? "justify-end" : "justify-start"}`}>
                {senderId !== user?.uid && <img src={userImage} alt="User" className="w-8 h-8 rounded-full mr-2" />}
                <div
                  className={`p-3 rounded-lg text-sm shadow-md 
                     ${senderId !== user?.uid ? "bg-gray-800 text-gray-200" : "bg-green-700 text-white"} 
                 max-w-[80%] break-words`}
                >
                  <p className="font-bold text-xs text-gray-400">
                    {senderId === user?.uid ? "You" : sender || (senderEmail ? senderEmail.split("@")[0] : "Unknown")}
                  </p>
                  <p className="break-words">{text}</p>
                  <small className="block text-right text-xs text-gray-400">
                    {timestamp?.seconds
                      ? new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
                      : ""}
                  </small>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to Bottom Button */}
        {isScrolledUp && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-20 mr-2 mb-2 right-4 bg-gray-700 text-white p-2 rounded-md shadow-lg hover:bg-gray-600 transition flex items-center"
          >
            <IoArrowDown size={24} />
          </button>
        )}

        {/* Input Field */}
        <div className="p-4 flex items-center bg-[#111111] border-t border-gray-700">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
    </div>
  );
}

export default GroupChatComponent;
