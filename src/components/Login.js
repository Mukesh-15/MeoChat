import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [cred, setCred] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: cred.username,
          password: cred.password,
        }),
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authToken);

        if (json.isVerified) {
          toast.success("Login Successful");
          navigate("/");
        } else {
          navigate("/VerifyOtp");
          toast.success("Login Successful but Not Verified");
        }
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 h-64 md:h-full flex flex-col items-center justify-center gap-4 p-6"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Meo
          <span className="ml-2 px-3 py-1 text-3xl font-bold text-white bg-indigo-600 rounded-lg shadow-lg">
            Chat
          </span>
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Welcome Back</h2>
        <p className="text-md text-gray-500 text-center max-w-sm mt-2">
          Dive back into your conversations and connect with friends instantly.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full md:w-1/2 h-full flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md p-8 glass rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Login</h1>
            <p className="text-sm text-gray-500 mt-2">
              Access your MeoChat account.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="Username"
                value={cred.username}
                className="w-full px-5 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
                name="username"
                required
                onChange={onChange}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-5 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
                name="password"
                value={cred.password}
                required
                onChange={onChange}
              />
              <span 
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
            >
              Login
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center w-full py-3 space-x-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Continue with Google</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
