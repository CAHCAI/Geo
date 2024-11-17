"use client";
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

const App: React.FC = () => {
  const [activePage, setActivePage] = useState("hpsa_search");
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

  const renderContent = () => {
    switch (activePage) {
      case "hpsa-search":
        return <HpsaSearch />;
      case "login":
        return <Login />;
      default:
        return <div className="text-gray-700">Welcome to Geo!</div>;
    }
  };

  return (
    <div className="bg-white h-[87vh] flex flex-col overflow-none">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full drop-shadow-lg z-50">
        <div>
          {/* Search Bar Section */}
          <div className="bg-gray-50 h-24 shadow-md border-b border-gray-200 flex items-center w-full px-0">
            <div className="flex justify-between items-center w-full px-4">

              {/* HCAI Logo */}
              <img
                src={GeoLogo}
                alt="Geo Logo"
                className="h-12 object-contain"
              />

              {/* Search Bar */}
              <div className="flex items-center w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
               
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
          <div className="bg-blue-800 h-16 flex items-center w-full">
            <div className="flex justify-evenly text-white text-lg md:text-xl font-bold w-full px-4">
              <a
                href="https://hcai.ca.gov/facilities/building-safety/"
                className="text-center hover:bg-blue-900 transition duration-300 px-4 py-2 flex-grow"
              >
                Building Safety & Finance
              </a>
              <a
                href="https://hcai.ca.gov/workforce/financial-assistance/"
                className="text-center hover:bg-blue-900 transition duration-300 px-4 py-2 flex-grow"
              >
                Loan Repayments, Scholarships & Grants
              </a>
              <a
                href="https://hcai.ca.gov/workforce/health-workforce/"
                className="text-center hover:bg-blue-900 transition duration-300 px-4 py-2 flex-grow"
              >
                Workforce Capacity
              </a>
              <a
                href="https://hcai.ca.gov/data/"
                className="text-center hover:bg-blue-900 transition duration-300 px-4 py-2 flex-grow"
              >
                Data & Reports
              </a>
              <a
                href="https://hcai.ca.gov/facility-finder/"
                className="text-center hover:bg-blue-900 transition duration-300 px-4 py-2 flex-grow"
              >
                Facility Finder
              </a>
            </div>
          </div>

          {/* Sub Navigation Section */}
          <div className="bg-gray-800 p-5 flex justify-end">
            <div className="flex space-x-4">
              <Button
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-md"
                onClick={() => setActivePage("home")}
              >
                Home
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-md"
                onClick={() => setActivePage("hpsa-search")}
              >
                HPSA Search
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-md"
                onClick={() => setActivePage("licensed-healthcare")}
              >
                Licensed Healthcare Facilities
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-md"
                onClick={() => setActivePage("api-reference")}
              >
                API Reference
              </Button>
              <Sheet>
                <SheetTrigger className="bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-800 h-9 rounded-md px-3">
                  <AlignJustify className="text-white" />
                </SheetTrigger>
                <SheetContent className="p-6 bg-gradient-to-br from-gray-100 to-blue-100 rounded-md">
                  <SheetHeader></SheetHeader>
                  <Login />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto flex-grow p-6 pt-[240px]">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;