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
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="bg-gray-800 drop-shadow-lg p-4 w-full">
        <div className="flex justify-between items-center w-full px-4">
          {/* Navbar Buttons */}
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
              <SheetTrigger className="bg-gradient-to-r from-blue-500 to-blue-800  hover:from-blue-600 hover:to-blue-800h-9 rounded-md px-3">
                <AlignJustify className="text-white" />
              </SheetTrigger>
              <SheetContent className="p-6 bg-gradient-to-br from-gray-100 to-blue-100 rounded-md">
                <SheetHeader></SheetHeader>
                <Login />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
