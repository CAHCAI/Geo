import React, { useEffect } from "react";
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
  useEffect(() => {
    // Set website title
    document.title = "Geo App";
  }, []);

  return (
    <html lang="en">
      <body className="antialiased">
        {/* Main Content */}
        <main className="container mx-auto">{children}</main>
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
