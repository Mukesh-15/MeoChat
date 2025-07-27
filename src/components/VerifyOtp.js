import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp({ active }) {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (active) {
      sendMail();
    }
  }, [active]);

  const onChange = (e) => {
    setOtp(e.target.value);
  };

  const sendMail = async () => {
    const response = await fetch(`https://meochat-backend.onrender.com/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const res = await response.json();

    if (res.success) {
      console.log("OTP sent");
    } else {
      console.log("OTP not sent");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpResponse = await fetch(`https://meochat-backend.onrender.com/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ otp }),
    });

    const res = await otpResponse.json();

    if (!res.success) {
      alert(res.message);
    } else {
      alert(res.message);
      navigate("/");
    }
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row backdrop-blur-md bg-black/30">
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              OTP Verification
            </h2>
            <p className="text-sm text-gray-500">
              We’ve sent a 6-digit code to your email. Please enter it below.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              maxLength="6"
              inputMode="numeric"
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 border text-center text-lg tracking-widest rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              name="otp"
              value={otp}
              onChange={onChange}
            />

            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Verify OTP
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Didn’t receive the code?{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={sendMail}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
