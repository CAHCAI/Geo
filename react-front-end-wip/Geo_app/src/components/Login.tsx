"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiLock } from "react-icons/fi";
import { Button } from "@/components/ui/button";

// Import the logos
import GeoLogo from "../assets/ca-gov-logo-login.png";
import HcaiLogo from "../assets/hcai-logo-login.png";

interface LoginProps {
  loggedIn: boolean;
  setLoggedIn: (state: boolean) => void;
}

export default function Login({ loggedIn, setLoggedIn }: LoginProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>(""); // Error message
  const [loading, setLoading] = useState<boolean>(false); // Loading spinner state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(loggedIn); // Local login state

  useEffect(() => {
    setIsLoggedIn(loggedIn);
    console.log(loggedIn + " hello");
  }, [loggedIn]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (username === "user" && password === "password") {
        alert("Login successful!");
        setError("");
        setLoggedIn(true); // Set login state to true
        setIsLoggedIn(true); // Update local login state
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="pt-2">
      {/* HCAI Logo */}
      <div className="absolute top-8 left-4">
        <img src={HcaiLogo} alt="HCAI Logo" className="h-12" />
      </div>
      <div className="relative flex flex-col pt-[12vh] r w-full h-full">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isLoggedIn ? (
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 mb-4">
              You are already logged in!
            </p>
            <Button
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-md"
              onClick={() => {
                setLoggedIn(false);
                setIsLoggedIn(false);
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-sm p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            style={{
              background: "linear-gradient(135deg, #e0f7fa, #ffffff, #bbdefb)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full p-2 pl-10 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full p-2 pl-10 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Login
              </button>

              {/* Forgot Password */}
              <div className="text-center text-sm mt-2">
                <a href="#" className="text-blue-500 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </form>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="absolute bottom-0 right-0 m-4">
          <img src={GeoLogo} alt="CA Gov Logo" className="h-10 opacity-80" />
        </footer>
      </div>
    </div>
  );
}