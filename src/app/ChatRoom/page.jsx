"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

export default function ChatRoom() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      sender: user.displayName,
      timestamp: new Date(),
    });
    setNewMessage("");
  };

  return (
    <div className="flex text-black flex-col items-center p-4">
      <h1 className="text-2xl font-bold">Chat Room</h1>
      <button onClick={() => signOut(auth)}>Logout</button>
      <div className="w-full max-w-md border p-4 my-4">
        {messages.map((msg) => (
          <p key={msg.id}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="border p-2 w-full"
      />
      <button onClick={sendMessage} className="bg-green-500 text-white px-4 py-2 mt-2">
        Send
      </button>
    </div>
  );
}
