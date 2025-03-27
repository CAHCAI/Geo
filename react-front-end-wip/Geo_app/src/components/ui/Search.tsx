import React, { useState } from "react";

// Simple regex to detect coords like "13, -22" or "13.123, -22.456"
function isCoordinateFormat(input: string): boolean {
  const coordRegex = /^-?\d{1,3}(\.\d+)?,\s*-?\d{1,3}(\.\d+)?$/;
  return coordRegex.test(input.trim());
}

interface InputWithButtonProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  fetchResults: () => void;
  isLoading: boolean;
}

export const Search: React.FC<InputWithButtonProps> = ({
  searchQuery,
  setSearchQuery,
  fetchResults,
  isLoading,
}) => {
  const [formatType, setFormatType] = useState<"coordinate" | "address">("address");

  // On input change, detect if it's coords or address
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    // If it matches our coordinate regex, set to coordinate
    if (val.trim() !== "" && isCoordinateFormat(val)) {
      setFormatType("coordinate");
    } else {
      setFormatType("address");
    }
  };

  // Decide which placeholder to show
  const placeholder =
    formatType === "coordinate"
      ? "Example: 37.7749, -122.4194"
      : "Example: California Men’s Colony, San Luis Obispo, CA...";

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-sm items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
      {/* Label for screen readers */}
      <label htmlFor="search-input" className="sr-only">
        Enter coordinates (lat, lng) or an address
      </label>
      {/* The text input */}
      <input
        id="search-input"
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        aria-describedby="search-hint"
        className="border-gray-300 border-2 bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 text-md px-2 py-1 w-full"
      />
      {/* Accessibility hint */}
      <p id="search-hint" className="sr-only">
        Type coordinates like "37.7749, -122.4194" or an address like "California Men’s Colony, Colony Dr, San Luis Obispo, CA 93409"
      </p>
      {/* Format indicator badge */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            formatType === "coordinate" ? "bg-green-500" : "bg-orange-500"
          }`}
          aria-label={formatType === "coordinate" ? "Coordinates" : "Address"}
        ></div>
        <span className="text-sm font-medium text-gray-700">
          {formatType === "coordinate" ? "Coordinates" : "Address"}
        </span>
      </div>
      {/* Search button */}
      <button
        className="bg-blue-600 hover:bg-blue-800 text-white w-full sm:w-auto text-md px-4 py-2 rounded-md"
        onClick={fetchResults}
        disabled={isLoading}
        aria-label="Search for HPSA data based on coordinates or address"
      >
        {isLoading ? "Loading..." : "Search"}
      </button>
    </div>
  );
};
