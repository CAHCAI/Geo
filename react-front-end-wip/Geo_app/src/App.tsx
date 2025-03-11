"use client";

import React, { useEffect, useState } from "react";

// Importing page components
import HpsaSearch from "@/components/HpsaSearch";
import AdminDashboard from "./components/AdminDashboard";
import Footer_2 from "./components/Footer/Footer_2";
import MainNav from "./components/headers/MainNav";
import MobileNav from "./components/headers/MobileNav";
import SearchBar from "./components/headers/SearchBar";
import TopNavBar from "./components/headers/TopNavBar";
import Home from "./components/Home";
import LicensedHealthcareFacilities from "./components/LicensedHealthcareFacilities";
import Login from "./components/Login";
import TestAdminCredentials from "./components/TestAdminCred";
import { cn } from "./lib/utils";
import APIReference from "./components/APIReference";
import { AlignJustify, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

const App: React.FC = () => {
  const [activePage, setActivePage] = useState("hpsa_search");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [isOpenMenu, setIsOpenMenu] = useState(true);

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
  
  const handleOpenMenu = (isOpen: boolean) => {
    setIsOpenMenu(isOpen);
  };

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
      return (
        <div className="flex justify-center my-8">
          <h1 className="text-3xl font-bold text-gray-700">Welcome to Geo!</h1>
        </div>
      ) 
  }
};

  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="drop-shadow-lg z-50">
        <div className="lg:block hidden px-4 bg-gray-100 w-full">
          <TopNavBar />
        </div>
        {/* Search Bar Section */}
        <SearchBar handleOpenMenu={handleOpenMenu} />
        {!isOpenMenu && <MobileNav />}
        {/* Main Navigation Links */}
        <div className="lg:flex hidden">
          <MainNav />
        </div>

        {/* Sub Navigation Section */}
        <div className="bg-gray-800 w-full">
          <div className=" flex  max-w-screen-xl mx-auto ">
            <div className=" ml-8 flex gap-3 overflow-x-auto scrollbar-hide">
              <button
                className={cn(
                  " hover:bg-black whitespace-nowrap text-white px-2 sm:px-4 py-3  text-sm sm:text-base",
                  activePage === "home" && "bg-black"
                )}
                onClick={() => setActivePage("home")}
              >
                Home
              </button>
              <button
                className={cn(
                  "hover:bg-black whitespace-nowrap text-white px-2 sm:px-4 py-3  text-sm sm:text-base",
                  activePage === "hpsa-search" && "bg-black"
                )}
                onClick={() => setActivePage("hpsa-search")}
              >
                HPSA Search
              </button>
              <button
                className={cn(
                  "hover:bg-black whitespace-nowrap text-white px-2 sm:px-4 py-3  text-sm sm:text-base",
                  activePage === "licensed-healthcare" && "bg-black"
                )}
                onClick={() => setActivePage("licensed-healthcare")}
              >
                Licensed Healthcare Facilities
              </button>
              <button
                className={cn(
                  "hover:bg-black whitespace-nowrap text-white px-2 sm:px-4 py-3  text-sm sm:text-base",
                  activePage === "api-reference" && "bg-black"
                )}
                onClick={() => setActivePage("api-reference")}
              >
                API Reference
              </button>

              {loggedIn && (
                <button
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2 rounded-md"
                  onClick={() => setActivePage("admin-dashboard")}
                >
                  Admin Dashboard
                </button>
              )} 
              <Sheet>
                <SheetTrigger className="hover:bg-black whitespace-nowrap text-white px-2 sm:px-4 py-3 text-sm sm:text-base rounded-md">
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
            <main className="container mx-auto flex-grow p-4 ">
        {renderContent()}
      </main>
      <footer className="px-4 bg-gray-50 w-full border-t border-gray-300">
        <Footer_2 />
      </footer>
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
