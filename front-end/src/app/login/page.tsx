"use client";

import { FormEvent, useState } from "react";

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>(''); // Error shown to user
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner

    // Simulate an API call delay
    setTimeout(() => {
      //Set username and password though backend 
      if (username === 'user' && password === 'password') {
        alert('Login successful!');
        setError('');
      } else {
        setError('Invalid username or password');
      }
      setLoading(false); // Hide loading spinner
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-72 p-5 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-1">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                required
              />
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <button
              type="submit"
              className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};


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