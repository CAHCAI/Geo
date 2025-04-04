"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";

import HpsaSearch from "@/components/HpsaSearch";
import AdminDashboard from "./components/AdminDashboard";
import Footer_2 from "./components/Footer/Footer_2";
import MainNav from "./components/headers/MainNav";
import MobileNav from "./components/headers/MobileNav";
import SearchBar from "./components/headers/SearchBar";
import TopNavBar from "./components/headers/TopNavBar";
import CordOverride from "./components/CordOverride";
import MapViewer from "./components/MapViewer";
import Home from "./components/Home";
import LicensedHealthcareFacilities from "./components/LicensedHealthcareFacilities";
import Login from "./components/Login";
import TestAdminCredentials from "./components/TestAdminCred";
import APIReference from "./components/APIReference";

import { AlignJustify } from "lucide-react";
import { cn } from "./lib/utils";

const App: React.FC = () => {
  const [activePage, setActivePage] = useState("hpsa_search");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [isOpenMenu, setIsOpenMenu] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/message/")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleOpenMenu = (isOpen: boolean) => {
    setIsOpenMenu(isOpen);
  };

  const renderContent = () => {
    switch (activePage) {
      case "hpsa-search":
        return <HpsaSearch />;
      case "login":
        return (
          <Login
            setLoggedIn={setLoggedIn}
            loggedIn={loggedIn}
            onClose={() => setActivePage("home")}
          />
        );
      case "admin-dashboard":
        return <AdminDashboard />;
      case "home":
        return <Home />;
      case "test_cred":
        return <TestAdminCredentials />;
      case "licensed-healthcare":
        return <LicensedHealthcareFacilities />;
      case "map-viewer":
        return <MapViewer />;
      case "api-reference":
        return <APIReference />;
      case "cord-override":
        return <CordOverride />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="drop-shadow-lg z-50">
        <div className="lg:block hidden px-4 bg-gray-100 w-full">
          <TopNavBar />
        </div>

        <SearchBar handleOpenMenu={handleOpenMenu} />
        {!isOpenMenu && <MobileNav />}

        <div className="lg:flex hidden">
          <MainNav />
        </div>

        <div className="bg-gray-800 w-full">
          <div className="flex max-w-screen-xl mx-auto">
            <div className="ml-8 flex gap-3 overflow-x-auto scrollbar-hide">
              {[
                { label: "Home", page: "home" },
                { label: "HPSA Search", page: "hpsa-search" },
                {
                  label: "Licensed Healthcare Facilities",
                  page: "licensed-healthcare",
                },
                { label: "API Reference", page: "api-reference" },
                { label: "Map Viewer", page: "map-viewer" },
              ].map(({ label, page }) => (
                <button
                  key={page}
                  className={cn(
                    "relative hover:bg-black whitespace-nowrap text-white px-2 sm:px-4 py-3 text-sm sm:text-base",
                    activePage === page &&
                      "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-8 after:border-r-8 after:border-b-8 after:border-t-gray-100 after:border-l-transparent after:border-r-transparent"
                  )}
                  onClick={() => setActivePage(page)}
                >
                  {label}
                </button>
              ))}

              {loggedIn && (
                <>
                  <button
                    className={cn(
                      "relative hover:bg-black whitespace-nowrap text-white px-2 sm:px-4 py-3 text-sm sm:text-base",
                      activePage === "admin-dashboard" &&
                        "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-8 after:border-r-8 after:border-b-8 after:border-t-gray-100 after:border-l-transparent after:border-r-transparent"
                    )}
                    onClick={() => setActivePage("admin-dashboard")}
                  >
                    Admin Dashboard
                  </button>

                  <button
                    className={cn(
                      "relative hover:bg-black whitespace-nowrap text-white px-2 sm:px-4 py-3 text-sm sm:text-base",
                      activePage === "cord-override" &&
                        "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-8 after:border-r-8 after:border-b-8 after:border-t-gray-100 after:border-l-transparent after:border-r-transparent"
                    )}
                    onClick={() => setActivePage("cord-override")}
                  >
                    Coordinate Override
                  </button>
                </>
              )}

              {/* 🧾 Hamburger opens login sidebar */}
              <Sheet>
                <SheetTrigger className="hover:bg-black whitespace-nowrap text-white px-2 sm:px-4 py-3 text-sm sm:text-base rounded-md">
                  <AlignJustify className="text-white" />
                </SheetTrigger>
                <SheetContent className="bg-white p-0 w-full sm:w-[550px]">
                  <Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto flex-grow p-4">
        {renderContent()}
      </main>

      <footer className="px-4 bg-gray-50 w-full border-t border-gray-300">
        <Footer_2 />
      </footer>
    </div>
  );
};

export default App;
