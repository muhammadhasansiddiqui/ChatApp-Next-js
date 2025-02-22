"use client";

import React, { useState } from "react";
import Image from "next/image";
import { auth, firebaseConfig } from "../../utils/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Swal from "sweetalert2";

export default function SmsLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleSendOTP = async () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }

      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      Swal.fire("Success", "OTP Sent Successfully!", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const code = otp.join(""); // Combine OTP inputs into a string
      const result = await confirmationResult.confirm(code);
      Swal.fire("Success", "Phone Verified Successfully!", "success");
      console.log("User Info:", result.user);
    } catch (error) {
      Swal.fire("Error", "Invalid OTP!", "error");
    }
  };

  return (
    <div className="container min-h-screen flex items-center justify-center bg-black text-white">
      <div className="form-container bg-[#111111] p-8 rounded-lg shadow-lg w-96">
        <Image src="/staranimated.gif" width={350} height={100} alt="Star Animation" />
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up with Phone✨</h2>
        <p className="text-center text-gray-400 mb-6">Enter your phone number to sign up.</p>

        <div className="mb-4">
          <label className="block mb-2">Phone Number</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>

        <button
          onClick={handleSendOTP}
          className="w-full p-3 rounded bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white font-semibold cursor-pointer mb-4"
        >
          Send OTP
        </button>

        <div id="recaptcha-container"></div>

        <div className="otp-group flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => {
                const newOtp = [...otp];
                newOtp[index] = e.target.value;
                setOtp(newOtp);
              }}
              className="w-10 h-10 text-center bg-gray-800 text-white rounded"
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOTP}
          className="w-full p-3 mt-4 rounded bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white font-semibold cursor-pointer"
        >
          Verify OTP
        </button>

        <p className="mt-4 text-center text-gray-400">
          Don't have an account? <a href="signup.html" className="hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
    