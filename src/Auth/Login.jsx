import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const value = {
    Name: "Admin",
    Password: "Admin@123",
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific field error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Clear general error on any input
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors); // Always update errors state
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous error message before validation
    setErrorMessage("");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    console.log("Form Submitted:", formData);

    if (
      formData.username === value.Name &&
      formData.password === value.Password
    ) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      setErrors({}); // Clear all errors on success
      navigate("/");
    } else {
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  // Check if form is valid for button state
  const isFormValid = formData.username.trim() && formData.password.trim();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-purple-900 to-gray-900 p-4">
      <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-700">
        <h2 className="text-3xl font-extrabold text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-400 mb-8 text-sm">Please login to continue</p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="text-gray-300 text-sm">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={`w-full p-3 mt-2 rounded-lg bg-gray-900 border text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 ${
                errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 focus:ring-indigo-500"
              }`}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full p-3 mt-2 rounded-lg bg-gray-900 border text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 focus:ring-indigo-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid} // Only disable if fields are empty
            className={`w-full py-3 font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 ${
              isFormValid
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
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
