import React, { useState } from "react";
import { Link } from "react-router-dom";
import VerifyOtp from "./VerifyOtp";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [cred, setCred] = useState({ username: "", email: "", password: "" });
  const [popup, setPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: cred.username,
          email: cred.email,
          password: cred.password,
        }),
      });

      const json = await response.json();
      if (json.success) {
        localStorage.setItem("token", json.authToken);
        setPopup(true);
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <VerifyOtp active={popup} change={setPopup} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 glass rounded-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="flex justify-center mb-6 mt-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Meo
            <span className="ml-1 px-3 py-1 text-xl font-bold text-white bg-indigo-600 rounded-lg shadow-md">
              Chat
            </span>
          </h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Create Account</h2>
          <p className="text-sm text-gray-500 mt-2">
            Join MeoChat to start connecting with friends.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={cred.email}
              className="w-full px-5 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
              required
              onChange={onChange}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={cred.username}
              className="w-full px-5 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
              required
              onChange={onChange}
            />
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={cred.password}
                className="w-full px-5 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
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
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 mt-4 font-semibold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Log in
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
      </motion.div>
    </div>
  );
};

export default SignUp;
