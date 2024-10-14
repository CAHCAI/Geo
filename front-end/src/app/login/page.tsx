"use client"
import { FormEvent, useState } from "react";

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>(''); //Error shown to user

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Username and Passwords need to be checked with backend
    if (username === 'user' && password === 'password') {
      alert('Login successful!');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-72 p-5 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
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
      </div>
    </div>

  );
};

