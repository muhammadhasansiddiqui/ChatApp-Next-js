import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase"; 

const sendMessage = async (text, user) => {
  if (!text.trim()) return;

  try {
    await addDoc(collection(db, "messages"), {
      text,
      sender: user.displayName,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export default sendMessage; 
