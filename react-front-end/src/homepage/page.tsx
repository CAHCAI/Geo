import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.svg"; // Adjust the path to your logo image

export default function HomePage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/message/")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div className="App">
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
          <Link
            to="/navbar"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Go to Navbar
          </Link>
          <Link
            to="/dashboard/app"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
