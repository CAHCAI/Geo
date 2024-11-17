"use client";
import React from "react";
import { Search } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header>
      {/* Top Row */}
      <div className="bg-gray-100 py-0.5 shadow-md border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          {/* CA Gov Logo */}
          <div>
            <img
              src="/assets/ca-gov-logo.png"
              alt="CA Gov Logo"
              className="h-10" // Increase CA Gov logo size
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-4 md:space-x-6 text-base md:text-lg">
            <a
              href="https://hcai.ca.gov/media-center/"
              className="font-semibold text-blue-800 hover:text-blue-900 transition duration-200 hover:underline underline-offset-4"
            >
              Newsroom
            </a>
            <a
              href="https://hcai.ca.gov/public-meetings/"
              className="font-semibold text-blue-800 hover:text-blue-900 transition duration-200 hover:underline underline-offset-4"
            >
              Public Meetings
            </a>
            <a
              href="https://hcai.ca.gov/about/"
              className="font-semibold text-blue-800 hover:text-blue-900 transition duration-200 hover:underline underline-offset-4"
            >
              About HCAI
            </a>
            <a
              href="https://hcai.ca.gov/mailing-list/"
              className="font-semibold text-blue-800 hover:text-blue-900 transition duration-200 hover:underline underline-offset-4"
            >
              Subscribe
            </a>
          </nav>
        </div>
      </div>

      {/* Middle Row */}
      <div className="bg-gray-50 py-0.5 shadow-md border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          {/* HCAI Logo */}
          <div>
            <img
              src="/assets/hcai-logo.png"
              alt="HCAI Logo"
              className="h-12" // Increase HCAI logo size
            />
          </div>

          {/* Search Bar */}
          <div className="flex items-center w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
            <input
              type="text"
              placeholder="Search ..."
              className="w-full text-base border-none focus:outline-none" // Increased input text size
            />
            <Search className="text-gray-500 ml-2" />
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-blue-800 py-0.25">
        <div className="container mx-auto flex justify-evenly gap-4 text-white text-xl font-bold">
          <a
            href="https://hcai.ca.gov/facilities/building-safety/"
            className="text-center hover:bg-blue-900 transition duration-300 whitespace-nowrap flex-grow"
          >
            Building Safety & Finance
          </a>
          <a
            href="https://hcai.ca.gov/workforce/financial-assistance/"
            className="text-center hover:bg-blue-900 transition duration-300 whitespace-nowrap flex-grow"
          >
            Loan Repayments, Scholarships & Grants
          </a>
          <a
            href="https://hcai.ca.gov/workforce/health-workforce/"
            className="text-center hover:bg-blue-900 transition duration-300 whitespace-nowrap flex-grow"
          >
            Workforce Capacity
          </a>
          <a
            href="https://hcai.ca.gov/data/"
            className="text-center hover:bg-blue-900 transition duration-300 whitespace-nowrap flex-grow"
          >
            Data & Reports
          </a>
          <a
            href="https://hcai.ca.gov/facility-finder/"
            className="text-center hover:bg-blue-900 transition duration-300 whitespace-nowrap flex-grow"
          >
            Facility Finder
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
