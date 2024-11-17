"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlignJustify } from "lucide-react";
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
    <div className="bg-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 fixed top-0 left-0 w-full drop-shadow-lg p-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-3xl font-bold">Geo</div>
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
              <SheetContent>
                <SheetHeader>
                  <Link
                    to="/login"
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-center"
                  >
                    Login
                  </Link>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto flex-grow p-6 pt-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
