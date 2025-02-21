import React from "react";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header Section */}
      <div className="bg-white rounded-lg mb-6">
        <p className="text-gray-800">
          Health Professional Shortage Areas (HPSAs) are designated by HRSA as
          having shortages of primary care, dental care, or mental health
          providers and may be geographic (a county or service area), population
          (e.g., low income or Medicaid eligible) or facilities (e.g., federally
          qualified health centers, or state or federal prisons).
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="bg-white rounded-lgd">
          <h2 className="text-blue-900 text-xl font-bold mb-4">
            HEALTH PROFESSIONAL SHORTAGE SEARCH
          </h2>
          <p className="text-gray-800 mb-4">
            Look up{" "}
            <a
              href="#"
              className="text-blue-900 hover:underline hover:text-blue-600"
            >
              Health Professional Shortage
            </a>
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              <b>HPSA PC:</b> Health Professional Shortage Area designated for
              Primary Care
            </li>
            <li>
              <b>HPSA DC:</b> Health Professional Shortage Area designated for
              Dental Health
            </li>
            <li>
              <b>HPSA MH:</b> Health Professional Shortage Area designated for
              Mental Health
            </li>
            <li>
              <b>MUA:</b> Medically Underserved Area
            </li>
            <li>
              <b>MUP:</b> Medically Underserved Population
            </li>
            <li>
              <b>PCSA:</b> Primary Care Shortage Area
            </li>
            <li>
              <b>RNSA:</b> Registered Nurse Shortage Area
            </li>
          </ul>
        </div>

        {/* Right Column */}
        <div className="bg-white rounded-lg">
          <h2 className="text-blue-900 text-xl font-bold mb-4">
            LICENSED HEALTHCARE FACILITIES
          </h2>
          <p className="text-gray-800 mb-4">
            Look up{" "}
            <a
              href="#"
              className="text-blue-900 hover:underline hover:text-blue-600"
            >
              Licensed Healthcare Facilities
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
