import React from "react";

import { useStateContext } from "../context";
import { useState } from "react";
import bcrypt from 'bcryptjs';

const OTP_Modal_Component = ({ hashedOTP }) => {
  const { setOTP_Modal, setOtpVerified, theme } = useStateContext();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      DataFieldError("Please enter a 6-digit OTP");
      return;
    }

    bcrypt.compare(otpValue, hashedOTP, (err, isMatch) => {
      if (err) {
        alert("Error verifying OTP:", err);
        return;
      }

      if (isMatch) {
        setOtpVerified(true);
        setOTP_Modal(false);
      } else {
        alert("Invalid OTP. Please try again.");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black shadow-xl bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        {/* <button
          onClick={() => setOTP_Modal(false)}
          className="text-gray-500 hover:text-gray-700 text-2xl float-right"
        >
          ×
        </button> */}

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter OTP</h2>
        <p className="text-gray-600 mb-6">
          Please enter the 6-digit OTP sent to your email.
        </p>

        <form onSubmit={verifyOTP} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={otp.length < 6}
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTP_Modal_Component;
