"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";

function SidebarComponent() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Firebase Authentication se current user fetch karo
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Firestore se users ka data fetch karna
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      console.log("🚀 ~ unsubscribeUsers ~ userList:", userList)
    });


    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
    };
  }, []);

  return (
    <div className="w-auto  h-screen bg-gray-900 text-white border-r border-gray-700 p-4">
      <h2 className="text-lg text-center font-bold mb-4">Members</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-2 p-2 border-b border-gray-700">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}`}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-semibold">{user.name || "Unknown User"}</p>
             
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SidebarComponent;
