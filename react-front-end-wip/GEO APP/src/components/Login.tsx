"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiLock } from "react-icons/fi";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>(""); // Error shown to user
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner

    setTimeout(() => {
      if (username === "user" && password === "password") {
        alert("Login successful!");
        setError("");
      } else {
        setError("Invalid username or password");
      }
      setLoading(false); // Hide loading spinner
    }, 2000);
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-[80vh] bg-transparent pt-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-6 bg-white rounded-3xl shadow-lg transform transition duration-500 hover:shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Sign In
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="username"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FiUser />
                </span>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FiLock />
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-center text-sm mt-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
            >
              Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

/*
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner

    try {
      // Replace 'YOUR_API_URL' with the actual URL of your backend endpoint
      const response = await fetch('YOUR_API_URL/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if the response is successful
      if (response.ok) {
        const data = await response.json();
        alert('Login successful!');
        console.log('Response Data:', data); // Handle the data as needed
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };
*/
