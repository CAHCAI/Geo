"use client";
import React from "react";
import { Search } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top Row */}
      <div className="bg-gray-100 py-2 shadow-md border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          {/* CA Gov Logo */}
          <div>
            <img
              src="/assets/ca-gov-logo.png"
              alt="CA Gov Logo"
              className="h-10"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a
                href="https://hcai.ca.gov/media-center/"
                className="text-md font-semibold text-blue-800 hover:text-blue-900 transition duration-200 hover:underline underline-offset-4"
              >
                Newsroom
              </a>
              <a
                href="https://hcai.ca.gov/public-meetings/"
                className="text-md font-semibold text-blue-800 hover:text-blue-900 transition duration-200 hover:underline underline-offset-4"
              >
                Public Meetings
              </a>
              <a
                href="https://hcai.ca.gov/about/"
                className="text-md font-semibold text-blue-800 hover:text-blue-900 transition duration-200 hover:underline underline-offset-4"
              >
                About HCAI
              </a>
              <a
                href="https://hcai.ca.gov/mailing-list/"
                className="text-md font-semibold text-blue-800 hover:text-blue-900 transition duration-200 hover:underline underline-offset-4"
              >
                Subscribe
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bg-gray-50 py-3 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* HCAI Logo */}
          <div>
            <img src="/assets/hcai-logo.png" alt="HCAI Logo" className="h-12" />
          </div>

          {/* Search Bar */}
          <div className="flex items-center max-w-lg w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200 transition duration-200">
            <input
              type="text"
              placeholder="Search ..."
              className="w-full border-none focus:outline-none"
            />
            <Search className="text-gray-500 ml-2" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
