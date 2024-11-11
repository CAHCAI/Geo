import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login/page'; // Import the login page component
import HomePage from './homepage/page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

/*
    <div className="App">
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <img src={logo} className="App-logo" alt="logo" />
      <div className="space-x-4">
        <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Go to Login
        </a>
        <a href="/navbar" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Go to Navbar
        </a>
        <a href="/dashboard/app" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Go to Dashboard
        </a>
      </div>
    </div>
    </div>
*/