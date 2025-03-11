import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Import local fonts
import "./fonts/GeistMonoVF.woff";
import "./fonts/GeistVF.woff";

// Main Root Layout Component
const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Set website title
    document.title = "Geo App";
  }, []);

  return (
    <html lang="en">
      <body className="">
        {/* Main Content */}
        <main className="">{children}</main>
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
