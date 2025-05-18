import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Import local fonts
import "./fonts/GeistMonoVF.woff";
import "./fonts/GeistVF.woff";
import { ThemeProvider } from "./utils/ThemeContext";

// Main Root Layout Component
const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Set website title
    document.title = "Geo App";
  }, []);

  return (
    <html lang="en" className=" scroll-smooth">
      <body className=" bg-white dark:bg-[#2f3136] min-h-screen">
        <ThemeProvider>
        {/* Main Content */}
          <main>{children}</main>
        </ThemeProvider>
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
      {/* <Header/> */}
      <App />
      {/* <Footer/> */}
    </RootLayout>
  </React.StrictMode>
);
