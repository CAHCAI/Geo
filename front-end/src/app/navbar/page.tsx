"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Importing page components
import HpsaSearch from "@/components/ui/HpsaSearch";
//import LicensedHealthcare from "@/components/LicensedHealthcare";
//import ApiReference from "@/components/ApiReference";

export default function Navbar() {
  const [activePage, setActivePage] = useState("hspa_search");

  // Function to render content based on the active page
  const renderContent = () => {
    switch (activePage) {
      case "hpsa-search":
        return <HpsaSearch />;
      // case "licensed-healthcare":
      //   return <LicensedHealthcare />;
      // case "api-reference":
      //   return <ApiReference />;
      default:
        return <div className="text-gray-700">Welcome to Geo!</div>;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <nav className="bg-gray-800 drop-shadow-lg p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-3xl font-bold">Geo</div>
          <div className="flex space-x-4">
            <Button
              className="bg-gray-600"
              onClick={() => setActivePage("home")}
            >
              <span className="text-white">Home</span>
            </Button>
            <Button
              className="bg-gray-600"
              onClick={() => setActivePage("hpsa-search")}
            >
              <span className="text-white">HPSA Search</span>
            </Button>
            <Button
              className="bg-gray-600"
              onClick={() => setActivePage("licensed-healthcare")}
            >
              <span className="text-white">Licensed Healthcare Facilities</span>
            </Button>
            <Button
              className="bg-gray-600"
              onClick={() => setActivePage("api-reference")}
            >
              <span className="text-white">API Reference</span>
            </Button>
            <Sheet>
              <SheetTrigger className="bg-gray-600 h-9 rounded-md px-3">
                <AlignJustify className="text-white" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Login</SheetTitle>
                  <SheetDescription>add login here</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      {/* Render the active page content */}
      <main className="container mx-auto p-6">{renderContent()}</main>
    </div>
  );
}
