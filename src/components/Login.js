import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import VerifyOtp from "./VerifyOtp";

export default function Login() {
  const [cred, setCred] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`https://meochat-backend.onrender.com/login`, {
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
      const token = json.authToken;
      localStorage.setItem("token", token);

      if (json.isVerified) {
        alert("Login Successful & Verified");
        navigate("/");
      } else {
        navigate("/VerifyOtp");
        alert("Login Successful but Not Verified");
      }
    } else {
      alert(json.message);
    }

    console.log(json);
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-[#fcfdff]">
      <div className="w-full md:w-1/2 h-64 md:h-full flex flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-[2em] font-bold text-gray-800">
          Meo
          <span className="ml-1 px-2 py-0.5 text-[0.9em] font-semibold text-white bg-blue-600 rounded">
            Chat
          </span>
        </h1>
        <h2 className="text-xl font-semibold text-gray-800">Welcome</h2>
        <p className="text-sm text-gray-500 text-center px-4">
          Login to MeoChat to continue chatting with friends.
        </p>
      </div>

      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-6 bg-[#d5dfed]">
        <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Login</h1>
            <p className="text-sm text-gray-500">
              Access your MeoChat account.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={cred.username}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="username"
              required
              onChange={onChange}
            />

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="password"
                value={cred.password}
                required
                onChange={onChange}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-600 cursor-pointer">
                <ion-icon name="eye-outline"></ion-icon>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-2 text-sm text-gray-400">OR</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          <button className="flex items-center justify-center w-full py-2 space-x-2 text-sm font-medium border rounded-md hover:bg-gray-50">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
