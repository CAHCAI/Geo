"use client";

import { FormEvent, useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import HcaiLogo from "../assets/hcai-logo-login.png";
import CaLogo from "../assets/ca-gov-logo.png";

interface LoginProps {
  loggedIn: boolean;
  setLoggedIn: (state: boolean) => void;
}

export default function Login({ loggedIn, setLoggedIn }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("hcai-username") || ""
      : "";
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      if (response.data.message === "Login successful") {
        setLoggedIn(true);
        setDisplayName(username);
        localStorage.setItem("hcai-username", username);
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-full w-full bg-white flex flex-col px-6 py-8 justify-between">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <img src={HcaiLogo} alt="HCAI Logo" className="h-10" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : loggedIn ? (
        <>
          <div className="flex flex-1 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-sm bg-white border border-gray-200 shadow-md rounded-xl px-6 py-8 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back{displayName ? `, ${displayName}` : ""}!
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                You’re securely signed in to your HCAI account.
              </p>

              <Button
                onClick={() => {
                  setLoggedIn(false);
                  setDisplayName("");
                  localStorage.removeItem("hcai-username");
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-base transition-all"
              >
                Logout
              </Button>
            </motion.div>
          </div>

          {/* CA Logo below the card */}
          <div className="mt-10 flex justify-center">
            <img
              src={CaLogo}
              alt="California State Government Logo"
              className="h-10 object-contain opacity-90"
            />
          </div>
        </>
      ) : (
        <>
          {/* Original login header UI preserved */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
              <span className="font-light">Sign in to</span>{" "}
              <span className="font-bold">Your Account</span>
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Use your HCAI credentials to login.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5 flex-1">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all"
            >
              Login
            </Button>

            <div className="text-sm text-center mt-4">
              <a href="#" className="text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>
          </form>

          {/* CA Logo on login (unchanged) */}
          <div className="mt-8 flex justify-center">
            <img
              src={CaLogo}
              alt="California State Government Logo"
              className="h-10 object-contain opacity-90 transition-all"
            />
          </div>
        </>
      )}
    </section>
  );
}
