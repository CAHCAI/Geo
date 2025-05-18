/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1DA1F2",
        secondary: "#14171A",
        accent: "#657786",
        background: "#F5F8FA",
        text: "#14171A",
      },
    },
  },
  plugins: [],
};
