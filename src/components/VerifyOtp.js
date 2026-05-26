import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function VerifyOtp({ active, change }) {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (active) {
      sendMail();
    }
  }, [active]);

  const onChange = (e) => {
    setOtp(e.target.value);
  };

  const sendMail = async () => {
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const otpResponse = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ otp }),
      });

      const res = await otpResponse.json();

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        if(change) change(false);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    }
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-gray-900/40"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            <div className="text-center mb-6 mt-2">
              <h2 className="text-2xl font-bold text-gray-800">
                OTP Verification
              </h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                We've sent a 6-digit code to your email. Please enter it below to verify your account.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                type="text"
                maxLength="6"
                inputMode="numeric"
                placeholder="000000"
                className="w-full px-4 py-4 border border-gray-200 text-center text-3xl font-bold tracking-[0.5em] text-indigo-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                required
                name="otp"
                value={otp}
                onChange={onChange}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 font-bold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
              >
                Verify OTP
              </motion.button>
            </form>

            <p className="mt-6 text-sm font-medium text-center text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                onClick={sendMail}
              >
                Resend
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
