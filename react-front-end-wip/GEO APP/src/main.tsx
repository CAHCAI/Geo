import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Header from "@/components/GeoHeader"; // Import Header
import Footer from "@/components/Footer"; // Import Footer
import App from "./App";

// Import local fonts
import "./fonts/GeistVF.woff";
import "./fonts/GeistMonoVF.woff";

// Main Root Layout Component
const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Render Header */}

        {/* Main Content */}
        <main>{children}</main>
        {/* Render Footer */}
      </body>
    </html>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </React.StrictMode>
);
