// src/components/ThemeToggle.tsx
import { ThemeContext } from "@/utils/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useContext } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-1.5 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
    >
      {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
}
