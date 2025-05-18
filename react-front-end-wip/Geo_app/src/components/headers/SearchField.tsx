import { Search, X } from "lucide-react";
import React, { useState } from "react";

const SearchField: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
      <div className=" hidden lg:flex items-center w-full max-w-md  rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 sm:py-3 shadow border-b border-gray-400   transition duration-200">
        <input
          type="text"
          placeholder="Search..."
          className="w-full text-sm md:text-base border-none focus:outline-none bg-transparent dark:text-white"
        />
        <Search className="text-gray-500 ml-2 cursor-pointer" />
      </div>
      <button onClick={handleClick} className=" lg:hidden flex p-3">
        {!isOpen ? (
          <Search size={35} className="text-gray-500 cursor-pointer" />
        ) : (
          <X size={35} className="text-gray-500 cursor-pointer" />
        )}
      </button>
      {isOpen && (
        <div className="flex flex-col lg:hidden bg-blue-500 p-3 rounded absolute right-10 z-20  shadow-md top-16">
          <p className=" text-white mb-1">Search by Keyword</p>
          <div className="flex items-center w-full max-w-md  rounded-lg px-4 py-2 bg-gray-50 sm:py-3 shadow border-b border-gray-400 transition duration-200">
            <input
              type="text"
              placeholder="Search..."
              className="w-full text-sm md:text-base border-none focus:outline-none bg-transparent"
            />
            <Search className="text-gray-500 ml-2 cursor-pointer" />
          </div>
        </div>
      )}
    </>
  );
};

export default SearchField;
