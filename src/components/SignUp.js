import React, { useState } from "react";
import { Link } from "react-router-dom";
import VerifyOtp from "./VerifyOtp";

const SignUp = () => {
  const [cred, setCred] = useState({ username: "", email: "", password: "" });
  const [popup,setPopup] = useState(false);

  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://meochat-backend.onrender.com/Signup`, {
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
        localStorage.setItem('token',json.authToken);
        setPopup(true);
      }else{
        alert(json.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <VerifyOtp active={popup} change={setPopup}/>
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Meo
            <span className="ml-1 px-2 py-0.5 text-sm font-semibold text-white bg-blue-600 rounded">
              Chat
            </span>
          </h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Welcome</h2>
          <p className="text-sm text-gray-500">
            Sign Up to MeoChat to continue.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={cred.email}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={true}
              onChange={onChange}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={cred.name}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={true}
              onChange={onChange}
            />
          </div>

          <div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={cred.password}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={true}
                onChange={onChange}
              />
              <span className="absolute text-lg inset-y-0 right-3 flex items-center text-gray-600 cursor-pointer">
                <ion-icon name="eye-outline"></ion-icon>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
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
  );
};

export default SignUp;
