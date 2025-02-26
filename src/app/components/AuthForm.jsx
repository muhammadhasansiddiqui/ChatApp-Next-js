"use client";

import { useState } from "react";
import GoogleLogo from "../../images/google-logo.png";
import FbLogo from "../../images/facebook-icon.png";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import AuthGuard from "../../utils/AuthGuard"
import Phone from "../../images/Phone.png";
import { auth, googleProvider } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();


  const handleAuth = async () => {
    try {
      let result;
      if (isLogin) {
        result = await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login Successful!");
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Signup Successful!");

        const user = result.user;
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName || email.split("@")[0],
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        });
      }

      console.log("User Info:", result.user);
      router.push("/ChatRoom");

    } catch (error) {
      toast.error(error.message);
    }
  };


  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success("Google Login Successful!");
      console.log("Google Login Success:", result.user);

      router.push("/ChatRoom");

    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFbLogin = async () => {
    toast.warning("Facebook Login Coming Soon...");
  };

  const handlePhoneLogin = async () => {
    toast.warning("SMS Login Coming Soon...");
    router.push("/sms-login");

  };

  return (

    <AuthGuard>
<div className="conatiner">

      <div className="flex flex-col w-full items-center justify-center
       min-h-screen bg-black text-white">
        <div className="bg-[#111111] p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {isLogin ? "Log in to your account✨" : "Create an account ✨"}
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Welcome! Please enter your details.
          </p>

          <label className="block mb-2">
            Email
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
            />
          </label>

          <label className="block mb-2">
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
            />
          </label>

          <button
            onClick={handleAuth}
            className="w-full p-3 rounded bg-gradient-to-r from-[#ff416c] to-[#ff4b2b]
             text-white font-semibold cursor-pointer mb-4 hover:from-[#ff4b2b] hover:to-[#ff416c]"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full mt-3 bg-black border border-gray-600 p-2 rounded flex items-center justify-center 
            transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b]"
          >
            <Image src={GoogleLogo} alt="Google Logo" width={25} height={25} className="mr-2" />
            Sign in with Google
          </button>

          <button
            onClick={handleFbLogin}
            className="w-full mt-3 bg-black border border-gray-600 p-2 rounded flex items-center justify-center 
            transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b]"
          >
            <Image src={FbLogo} alt="FB Logo" width={25} height={25} className="mr-2" />
            Sign in with Facebook
          </button>

          <button
            onClick={handlePhoneLogin}
            className="w-full mt-3 bg-black border border-gray-600 p-2 rounded flex items-center
             justify-center transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b]"
          >
            <Image src={Phone} alt="Phone Logo" width={25} height={25} className="mr-2" />
            Sign in with SMS
          </button>

          <p
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-center text-gray-400 cursor-pointer hover:underline"
          >
            {isLogin ? "Create an account" : "Already have an account? Log in"}
          </p>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>

      </div>
    </AuthGuard>
  );
}
