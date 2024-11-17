"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlignJustify } from "lucide-react";
import GeoLogo from "@/assets/hcai-logo.png";
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
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="bg-gray-800 fixed top-0 left-0 w-full drop-shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img src={GeoLogo} alt="Geo Logo" className="h-14" />
            <div className="text-white text-4xl font-bold"></div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={() => setActivePage("home")}
            >
              Home
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={() => setActivePage("hpsa-search")}
            >
              HPSA Search
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={() => setActivePage("licensed-healthcare")}
            >
              Licensed Healthcare Facilities
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={() => setActivePage("api-reference")}
            >
              API Reference
            </Button>
            <Sheet>
              <SheetTrigger className="bg-blue-500 h-9 rounded-md px-3">
                <AlignJustify className="text-white" />
              </SheetTrigger>
              <SheetContent className="p-6 bg-white rounded-md">
                <SheetHeader></SheetHeader>
                <Login />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto flex-grow p-6 pt-24">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
