import React from "react";

const Home: React.FC = () => {
  return (
    <>
      {/* 1. Skip Link for Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white p-2 rounded"
      >
        Skip to main content
      </a>

      {/* 2. Header Section (semantic <header> rather than a <div>) */}
      <header className="container mx-auto px-4 py-4">
        {/* Example main heading (H1) for the page */}
        <h1 className="text-blue-900 text-2xl font-bold mb-4">
          Health Professional Shortage Areas (HPSAs)
        </h1>

        <p className="text-gray-800 bg-white rounded-lg p-4">
          Health Professional Shortage Areas (HPSAs) are designated by HRSA as
          having shortages of primary care, dental care, or mental health
          providers and may be geographic (a county or service area),
          population-based (e.g., low income or Medicaid eligible) or facilities
          (e.g., federally qualified health centers, or state or federal
          prisons).
        </p>
      </header>

      {/* 3. Main Content Area */}
      <main
        id="main-content"
        className="container mx-auto px-4 py-4"
        tabIndex={-1} // helps screen readers jump directly here
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column Section */}
          <section aria-labelledby="search-h2" className="bg-white rounded-lg p-4">
            <h2
              id="search-h2"
              className="text-blue-900 text-xl font-bold mb-4"
            >
              Health Professional Shortage Search
            </h2>
            <p className="text-gray-800 mb-4">
              Look up{" "}
              <a
                href="#hpsa-search" // Replace with the actual destination if available
                className="text-blue-900 hover:underline focus:underline"
              >
                specific Health Professional Shortage Areas
              </a>
              .
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>
                <strong>HPSA PC:</strong> Health Professional Shortage Area
                designated for Primary Care
              </li>
              <li>
                <strong>HPSA DC:</strong> Health Professional Shortage Area
                designated for Dental Health
              </li>
              <li>
                <strong>HPSA MH:</strong> Health Professional Shortage Area
                designated for Mental Health
              </li>
              <li>
                <strong>MUA:</strong> Medically Underserved Area
              </li>
              <li>
                <strong>MUP:</strong> Medically Underserved Population
              </li>
              <li>
                <strong>PCSA:</strong> Primary Care Shortage Area
              </li>
              <li>
                <strong>RNSA:</strong> Registered Nurse Shortage Area
              </li>
            </ul>
          </section>

          {/* Right Column Section */}
          <section
            aria-labelledby="licensed-h2"
            className="bg-white rounded-lg p-4"
          >
            <h2
              id="licensed-h2"
              className="text-blue-900 text-xl font-bold mb-4"
            >
              Licensed Healthcare Facilities
            </h2>
            <p className="text-gray-800 mb-4">
              Look up{" "}
              <a
                href="#licensed-facilities" // Replace with the actual destination if available
                className="text-blue-900 hover:underline focus:underline"
              >
                Licensed Healthcare Facilities
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
