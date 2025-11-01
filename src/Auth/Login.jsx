import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const value = {
    Name: "Admin",
    Password: "Admin@123",
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    if (
      formData.username === value.Name &&
      formData.password === value.Password
    ) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-purple-900 to-gray-900 p-4">
      <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-700">
        <h2 className="text-3xl font-extrabold text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-400 mb-8 text-sm">Please login to continue</p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="text-gray-300 text-sm">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full p-3 mt-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 mt-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <p className="text-gray-400 text-sm">
            Don’t have an account?{" "}
            <a href="#" className="text-indigo-400 hover:underline">
              Register here
            </a>
          </p>
        </div>

        <div className="mt-6 text-gray-500 text-xs">© 2025 YourCompany</div>
      </div>
    </div>
  );
};

export default Login;
