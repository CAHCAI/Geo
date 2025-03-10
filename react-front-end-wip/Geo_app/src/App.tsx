"use client";  // Add this as the first line

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlignJustify, Search } from "lucide-react";
import GeoLogo from "@/assets/hcai-logo.png";
import CaGovLogo from "@/assets/ca-gov-logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

// Importing page components
import HpsaSearch from "@/components/HpsaSearch";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import Home from "./components/Home";
import TestAdminCredentials from "./components/TestAdminCred";
import LicensedHealthcareFacilities from "./components/LicensedHealthcareFacilities";
import APIReference from "./components/APIReference";

const App: React.FC = () => {
  const [activePage, setActivePage] = useState("hpsa_search");
  const [loggedIn, setLoggedIn] = useState(false);
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
  
  /*const [activePage, setActivePage] = useState("hpsa_search");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/message/")
      .then((response) => response.json())  // ✅ Ensure it expects JSON
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Geo App</h1>
      <p>API Message: {message}</p>
    </div>
  );
*/
  const renderContent = () => {
    switch (activePage) {
      case "hpsa-search":
        return <HpsaSearch />;
      case "login":
        return <Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} />;
      case "admin-dashboard":
        return <AdminDashboard />;
      case "home":
        return <Home />;
      case "test_cred":
        return <TestAdminCredentials />;
      case "licensed-healthcare":
        return <LicensedHealthcareFacilities />;
      case "api-reference":
        return <APIReference />;
      default:
        return <div className="text-gray-700">Welcome to Geo!</div>;
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full drop-shadow-lg z-50">
        <div>
        </div>
          {/* Search Bar Section */}
          <div className="bg-gray-50 h-20 sm:h-24 shadow-md border-b border-gray-200 flex items-center w-full px-4">
            <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto">
              {/* HCAI Logo */}
              <img
                src={GeoLogo}
                alt="Geo Logo"
                className="h-10 sm:h-12 object-contain"
              />
              {/* Search Bar */}
              <div className="flex items-center w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 sm:py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full text-sm md:text-base border-none focus:outline-none"
                />
                <Search className="text-gray-500 ml-2" />
              </div>
            </div>
          </div>

          {/* Main Navigation Links */}
          <div className="bg-blue-800 w-full">
            <div className="h-14 sm:h-16 flex items-center w-full max-w-screen-xl mx-auto">
              <div className="flex justify-evenly text-white text-base sm:text-lg md:text-xl font-bold w-full px-4">
                <a
                  href="https://hcai.ca.gov/facilities/building-safety/"
                  className="text-center hover:bg-blue-900 transition duration-300 px-3 py-2 flex-grow"
                >
                  Building Safety & Finance
                </a>
                <a
                  href="https://hcai.ca.gov/workforce/financial-assistance/"
                  className="text-center hover:bg-blue-900 transition duration-300 px-3 py-2 flex-grow"
                >
                  Loan Repayments, Scholarships & Grants
                </a>
                <a
                  href="https://hcai.ca.gov/workforce/health-workforce/"
                  className="text-center hover:bg-blue-900 transition duration-300 px-3 py-2 flex-grow"
                >
                  Workforce Capacity
                </a>
                <a
                  href="https://hcai.ca.gov/data/"
                  className="text-center hover:bg-blue-900 transition duration-300 px-3 py-2 flex-grow"
                >
                  Data & Reports
                </a>
                <a
                  href="https://hcai.ca.gov/facility-finder/"
                  className="text-center hover:bg-blue-900 transition duration-300 px-3 py-2 flex-grow"
                >
                  Facility Finder
                </a>
              </div>
            </div>
          </div>

          {/* Sub Navigation Section */}
          <div className="bg-gray-800 w-full">
            <div className="p-4 sm:p-5 flex justify-end max-w-screen-xl mx-auto">
              <div className="flex space-x-3 sm:space-x-4">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
                  onClick={() => setActivePage("home")}
                >
                  Home
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
                  onClick={() => setActivePage("hpsa-search")}
                >
                  HPSA Search
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
                  onClick={() => setActivePage("licensed-healthcare")}
                >
                  Licensed Healthcare Facilities
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
                  onClick={() => setActivePage("api-reference")}
                >
                  API Reference
                </Button>

              {loggedIn && (
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2 rounded-md"
                  onClick={() => setActivePage("admin-dashboard")}
                >
                  Admin Dashboard
                </Button>
              )}
              <Sheet>
                <SheetTrigger className="bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-800 h-9 rounded-md px-3">
                  <AlignJustify className="text-white" />
                </SheetTrigger>
                <SheetContent className="p-6 bg-gradient-to-br from-gray-100 to-blue-100 rounded-md">
                  <SheetHeader></SheetHeader>
                  <Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto flex-grow p-4 sm:p-6 pt-40 sm:pt-48 lg:pt-56">
        {renderContent()}
      </main>
    </div>
  );
};



export default App;

/*
              <Button
                className="bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-md"
                onClick={() => setActivePage("test_cred")}
              >
                Test
              </Button>
*/