import GeoLogo from "@/assets/hcai-logo.png";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import SearchField from "./SearchField";

const SearchBar = ({
  handleOpenMenu,
}: {
  handleOpenMenu: (isOpen: boolean) => void;
}) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const handleClick = () => {
    setIsOpenMenu((prev) => !prev);
    handleOpenMenu(isOpenMenu);
  };
  return (
    <div className="bg-gray-50 dark:bg-black h-20 sm:h-24 shadow-md border-b border-gray-200 flex items-center w-full px-4 relative">
      <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto">
        {/* HCAI Logo */}
        <button
          onClick={handleClick}
          className="text-gray-500 cursor-pointer lg:hidden flex"
        >
          {isOpenMenu ? <X size={35} /> : <Menu size={35} />}
        </button>
        <a href="/">
          <img
            src={GeoLogo}
            alt="Geo Logo"
            className="h-8 sm:h-10 object-contain"
          />
        </a>
        {/* Search Bar */}
        <SearchField />
      </div>
    </div>
  );
};

export default SearchBar;
