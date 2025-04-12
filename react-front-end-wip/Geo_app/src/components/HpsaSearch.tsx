"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Table from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Alert {
  id: number;
  type: "error" | "success" | "info";
  message: string;
}

interface RegisteredNurseShortageAreaItem {
  rnsa: string;
  Effective: string;
  spa_name: string;
}

interface MedicalServiceStudyAreaItem {
  mssaid: string;
  definition: string;
  county: string;
  censustract: string;
  censuskey: string;
}
interface PrimaryCareShortageAreaItem {
  pcsa: string;
  scoretota: string;
}

interface HealthServiceAreaItem {
  hsa_name: string;
  hsa_number: string;
}

export const InputWithButton: React.FC<{
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  fetchResults: () => void;
  isLoading: boolean;
}> = ({ searchQuery, setSearchQuery, fetchResults, isLoading }) => (
  <div className="flex flex-col sm:flex-row w-full max-w-sm items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
    <label htmlFor="coordinates-input" className="sr-only">
      Enter coordinates (latitude, longitude)
    </label>
    <Input
      id="coordinates-input"
      type="text"
      placeholder="Enter coordinates (lat, lng)..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className=" border-gray-300 border-2 bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 text-md"
      aria-describedby="coordinate-hint"
      
    />
    <p id="coordinate-hint" className="sr-only">
      Example: 37.7749, -122.4194
    </p>
    <Button
      className="bg-blue-600  hover:bg-blue-800 text-white w-full sm:w-auto text-md"
      onClick={fetchResults}
      disabled={isLoading}
      aria-label="Search for HPSA data based on coordinates"
    >
      {isLoading ? "Loading..." : "Search"}
    </Button>
  </div>
);

const fixedApiKey = import.meta.env.VITE_API_KEY;

// Helper function to transpose data
const transposeData = (data: any[], columns: any[]) => {
  return columns.map((column) => ({
    Header: column.Header,
    rows: data.map((item) => item[column.accessor]),
  }));
};

const HpsaSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchResults = async () => {
    console.log("fetchResults function triggered.");
    setError(null);
  
    if (!searchQuery.trim()) {
      console.error("No search query provided.");
      setError("Please enter valid coordinates.");
      addAlert("error", "Please enter valid coordinates.");
      return;
    }
  
    setIsLoading(true);
  
    let lat: number | null = null;
    let lng: number | null = null;
  
    try {
      // Check if input is a coordinate
      const parts = searchQuery.split(",");
      if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
        lat = parseFloat(parts[0].trim());
        lng = parseFloat(parts[1].trim());
      } else {
        // If input is an address, try to get coordinates from override API
        const overrideRes = await fetch(`http://localhost:8000/api/override-locations?address=${encodeURIComponent(searchQuery)}`, {
          method: "GET",
          headers: {
            "X-API-KEY": fixedApiKey,
          },
        });
        const overrideData = await overrideRes.json();
        
        if (overrideRes.ok && overrideData.latitude && overrideData.longitude) {
          lat = overrideData.latitude;
          lng = overrideData.longitude;
          console.log("Using coordinates from override:", lat, lng);
        } else {
          console.error("Could not resolve address to coordinates.");
          setError("Could not resolve address to coordinates.");
          addAlert("error", "Could not resolve address to coordinates.");
          return;
        }
      }
  
      const apiUrl = `http://localhost:8000/api/search?lat=${lat}&lng=${lng}`;
      console.log("Fetching from API:", apiUrl);
  
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": fixedApiKey,
        },
      });
  
      const data = await response.json();
      console.log("Fetched data:", data);
  
      if (
        Object.keys(data).length === 0 ||
        (!data.senate && !data.assembly && !data.congressional && !data.hsa)
      ) {
        console.warn("No results found.");
        setError("No results found.");
        addAlert("error", "No results found.");
      } else {
        setSearchResults(data);
        console.table(data);
        addAlert("success", "Search results retrieved successfully.");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Failed to retrieve data.");
      addAlert("error", "Failed to retrieve data.");
    } finally {
      setIsLoading(false);
    }
  };
  

  // Add a new alert
  const addAlert = (type: Alert["type"], message: string) => {
    const newAlert: Alert = {
      id: Date.now(),
      type,
      message,
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

    // Automatically remove the alert after 10 seconds
    setTimeout(() => {
      removeAlert(newAlert.id);
    }, 10000);
  };

  // Remove an alert by id
  const removeAlert = (id: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const primaryHealthCareColumns = [
    { Header: "HPSA Source ID", accessor: "HPSASourceID" },
    { Header: "Designated", accessor: "Designated" },
    { Header: "Designated On", accessor: "DesignatedOn" },
    { Header: "Formal Ratio", accessor: "Ratio" },
    { Header: "Population Below Poverty", accessor: "Poverty" },
    { Header: "Designation Population", accessor: "Population" },
    { Header: "Estimated Underserved", accessor: "Underserved" },
    { Header: "Estimated Served", accessor: "Served" },
    { Header: "Priority Score", accessor: "Score" },
  ];

  const mentalHealthCareColumns = [
    { Header: "HPSA Source ID", accessor: "HPSASourceID" },
    { Header: "Designated", accessor: "Designated" },
    { Header: "Designated On", accessor: "DesignatedOn" },
    { Header: "Formal Ratio", accessor: "Ratio" },
    { Header: "Population Below Poverty", accessor: "Poverty" },
    { Header: "Designation Population", accessor: "Population" },
    { Header: "Estimated Underserved", accessor: "Underserved" },
    { Header: "Estimated Served", accessor: "Served" },
    { Header: "Priority Score", accessor: "Score" },
  ];

  const dentalHealthCareColumns = [
    { Header: "HPSA Source ID", accessor: "HPSASourceID" },
    { Header: "Designated", accessor: "Designated" },
    { Header: "Designated On", accessor: "DesignatedOn" },
    { Header: "Formal Ratio", accessor: "Ratio" },
    { Header: "Population Below Poverty", accessor: "Poverty" },
    { Header: "Designation Population", accessor: "Population" },
    { Header: "Estimated Underserved", accessor: "Underserved" },
    { Header: "Estimated Served", accessor: "Served" },
    { Header: "Priority Score", accessor: "Score" },
  ];

  const healthServiceAreaColumns = [
    { Header: "Health Service Area", accessor: "HealthServiceArea" },
  ];
  const laServicePlanningAreaColumns = [
    { Header: "LA Service Planning Area", accessor: "spa_name" },
  ];
  const assemblyDistrictColumns = [
    { Header: "Number", accessor: "district_number" },
    { Header: "District Label", accessor: "district_label" },
    { Header: "Population", accessor: "population" },
  ];

  const senateDistrictColumns = [
    { Header: "Number", accessor: "district_number" },
    { Header: "District Label", accessor: "district_label" },
    { Header: "Population", accessor: "population" },
  ];

  const congressionalDistrictColumns = [
    { Header: "Number", accessor: "district_number" },
    { Header: "District Label", accessor: "district_label" },
    { Header: "Population", accessor: "population" },
  ];

  const emptyMentalHealthRow = {
    Designated: "No",
  };

  // Table data
  const baseTableData = [
    {
      ID: searchResults?.MedicalServiceStudyArea?.length
        ? searchResults.MedicalServiceStudyArea.map(
            (item: MedicalServiceStudyAreaItem) => `${item.mssaid}`
          )
        : "N/A",
      Definition: searchResults?.MedicalServiceStudyArea?.length
        ? searchResults.MedicalServiceStudyArea.map(
            (item: MedicalServiceStudyAreaItem) => `${item.definition}`
          )
        : "N/A",
      Tract: searchResults?.MedicalServiceStudyArea?.length
        ? searchResults.MedicalServiceStudyArea.map(
            (item: MedicalServiceStudyAreaItem) => `${item.censustract}`
          )
        : "N/A",
      Key: searchResults?.MedicalServiceStudyArea?.length
        ? searchResults.MedicalServiceStudyArea.map(
            (item: MedicalServiceStudyAreaItem) => `${item.censuskey}`
          )
        : "N/A",
      County: searchResults?.MedicalServiceStudyArea?.length
        ? searchResults.MedicalServiceStudyArea.map(
            (item: MedicalServiceStudyAreaItem) => `${item.county}`
          )
        : "N/A",
      MUA: "No",
      MUP: "No",
      PCSA: searchResults?.PrimaryCareShortageArea?.length
        ? searchResults.PrimaryCareShortageArea.map(
            (item: PrimaryCareShortageAreaItem) =>
              `${item.pcsa} (${item.scoretota})`
          )
        : "N/A",

      RNSA: searchResults?.RegisteredNurseShortageArea?.length
        ? searchResults.RegisteredNurseShortageArea.map(
            (item: RegisteredNurseShortageAreaItem) =>
              `${item.rnsa} (${item.Effective})`
          )
        : "N/A",
    },
  ];

  const primaryHealthCareData = searchResults?.PrimaryCareHPSA?.length
    ? searchResults.PrimaryCareHPSA.map((item: any) => ({
        HPSASourceID: item["HPSA Source ID"] ?? "N/A",
        Designated: item.Designated ?? "No",
        DesignatedOn: item["Designated On"] ?? "N/A",
        Ratio: item["Formal Ratio"] ?? "N/A",
        Poverty: item["Population Below Poverty"] ?? "N/A",
        Population: item["Designation Population"] ?? "N/A",
        Underserved: item["Estimated Underserved"] ?? "N/A",
        Served: item["Estimated Served"] ?? "N/A",
        Score: item["Priority Score"] ?? "N/A",
      }))
    : [emptyMentalHealthRow];

  const mentalHealthCareData = searchResults?.MentalHealthHPSA?.length
    ? searchResults.MentalHealthHPSA.map((item: any) => ({
        HPSASourceID: item["HPSA Source ID"] ?? "N/A",
        Designated: item.Designated ?? "No",
        DesignatedOn: item["Designated On"] ?? "N/A",
        Ratio: item["Formal Ratio"] ?? "N/A",
        Poverty: item["Population Below Poverty"] ?? "N/A",
        Population: item["Designation Population"] ?? "N/A",
        Underserved: item["Estimated Underserved"] ?? "N/A",
        Served: item["Estimated Served"] ?? "N/A",
        Score: item["Priority Score"] ?? "N/A",
      }))
    : [emptyMentalHealthRow];

  const dentalHealthCareData = searchResults?.DentalHealthHPSA?.length
    ? searchResults.DentalHealthHPSA.map((item: any) => ({
        HPSASourceID: item["HPSA Source ID"] ?? "N/A",
        Designated: item.Designated ?? "No",
        DesignatedOn: item["Designated On"] ?? "N/A",
        Ratio: item["Formal Ratio"] ?? "N/A",
        Poverty: item["Population Below Poverty"] ?? "N/A",
        Population: item["Designation Population"] ?? "N/A",
        Underserved: item["Estimated Underserved"] ?? "N/A",
        Served: item["Estimated Served"] ?? "N/A",
        Score: item["Priority Score"] ?? "N/A",
      }))
    : [emptyMentalHealthRow];

  const healthServiceAreaData = searchResults?.healthservicearea?.length
    ? searchResults.healthservicearea.map((item: HealthServiceAreaItem) => ({
        HealthServiceArea: `${item.hsa_name} (${item.hsa_number})`,
      }))
    : [{ HealthServiceArea: "N/A" }];

  const laServicePlanningAreaData = searchResults?.LaServicePlanning?.length
    ? searchResults.LaServicePlanning.map((item: { spa_name: string }) => ({
        spa_name: item.spa_name,
      }))
    : [
        {
          spa_name: "N/A",
        },
      ];

  // Transpose the data for the required tables
  const transposedAssemblyData = transposeData(
    searchResults?.assembly || [],
    assemblyDistrictColumns
  );
  const transposedSenateData = transposeData(
    searchResults?.senate || [],
    senateDistrictColumns
  );
  const transposedCongressionalData = transposeData(
    searchResults?.congressional || [],
    congressionalDistrictColumns
  );

  const transposedHealthServiceAreaData = transposeData(
    healthServiceAreaData,
    healthServiceAreaColumns
  );

  const transposedLAServicePlanningData = transposeData(
    laServicePlanningAreaData,
    laServicePlanningAreaColumns
  );

  const transposedBaseTableData = transposeData(baseTableData, [
    { Header: "MSSA ID", accessor: "ID" },
    { Header: "MSSA Definition", accessor: "Definition" },
    { Header: "Census Tract", accessor: "Tract" },
    { Header: "Census Key", accessor: "Key" },
    { Header: "County", accessor: "County" },
    { Header: "MUA", accessor: "MUA" },
    { Header: "MUP", accessor: "MUP" },
    { Header: "PCSA", accessor: "PCSA" },
    { Header: "RNSA", accessor: "RNSA" },
  ]);

  const transposedPrimaryCareData = transposeData(
    primaryHealthCareData,
    primaryHealthCareColumns
  );

  const transposedMentalHealthData = transposeData(
    mentalHealthCareData,
    mentalHealthCareColumns
  );

  const transposedDentalHealthData = transposeData(
    dentalHealthCareData,
    dentalHealthCareColumns
  );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white p-2 rounded"
      >
        Skip to main content
      </a>
      <header className="container mx-auto pt-5 px-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Health Professional Shortage Areas (HPSA) Search
        </h1>
      </header>
      <div className="container mx-auto pt-5 px-4 space-y-4">
        {/* Alerts Section */}
        <section
          className="p-0 mb-1"
          role="region"
          aria-labelledby="alerts-heading"
        >
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg ${
                  alert.type === "error"
                    ? "bg-red-100 text-red-700"
                    : alert.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <p>{alert.message}</p>
              </div>
            ))}
          </div>
        </section>

        <InputWithButton
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fetchResults={fetchResults}
          isLoading={isLoading}
        />
        
        <p className="text-sm text-gray-500 mt-1">
          Example: <span className="italic">37.7749, -122.4194</span> or{" "}
          <span className="italic">California Men’s Colony, San Luis Obispo, CA</span>
        </p>


        {searchResults?.senate?.length > 0 && (
          <>
            {/* Base Table */}
            <div className="relative">
              <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white max-h-[250px] sm:max-h-[300px] overflow-auto">
                <div className="space-y-2">
                  {transposedBaseTableData.map((row, index) => (
                    <div
                      key={index}
                      className={`py-2 ${
                        index !== transposedBaseTableData.length - 1
                          ? "border-b border-gray-300"
                          : ""
                      }`}
                    >
                      <div className="font-semibold text-gray-800">
                        {row.Header}:
                      </div>
                      {row.rows.map((cell, idx) => (
                        <div key={idx} className="text-gray-700">
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2 */}
          </>
        )}

        {/* Row 3 - Using Transposed Data Needed to Make Rows Instead of Columns*/}
        <div className="w-full space-y-4">
          {searchResults?.senate?.length > 0 && (
            <div className="flex flex-wrap gap-4 pb-4">
              <div className="relative">
                <div className="border border-gray-300 rounded-lg shadow-md bg-white min-h-[400px] max-h-[400px] overflow-auto resize-x min-w-[300px] w-fit max-w-[350px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white p-4 ">
                    Primary Health Care
                  </h3>
                  <div className="space-y-2 p-4 ">
                    {transposedPrimaryCareData.map((row, index) => (
                      <div
                        key={index}
                        className={`py-2 ${
                          index !== transposedPrimaryCareData.length - 1
                            ? "border-b border-gray-300"
                            : ""
                        }`}
                      >
                        <div className="font-semibold text-gray-800">
                          {row.Header}:
                        </div>
                        {row.rows.map((cell, idx) => (
                          <div key={idx} className="text-gray-700">
                            {cell}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="border border-gray-300 rounded-lg shadow-md bg-white min-h-[400px] max-h-[400px] overflow-auto resize-x min-w-[300px] w-fit max-w-[350px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white p-4 ">
                    Mental Health Care
                  </h3>
                  <div className="space-y-2 p-4 ">
                    {transposedMentalHealthData.map((row, index) => (
                      <div
                        key={index}
                        className={`py-2 ${
                          index !== transposedMentalHealthData.length - 1
                            ? "border-b border-gray-300"
                            : ""
                        }`}
                      >
                        <div className="font-semibold text-gray-800">
                          {row.Header}:
                        </div>
                        {row.rows.map((cell, idx) => (
                          <div key={idx} className="text-gray-700">
                            {cell}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="border border-gray-300 rounded-lg shadow-md bg-white min-h-[400px] max-h-[400px] overflow-auto resize-x min-w-[300px] w-fit max-w-[350px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white p-4 ">
                    Dental Health Care
                  </h3>
                  <div className="space-y-2 p-4 ">
                    {transposedDentalHealthData.map((row, index) => (
                      <div
                        key={index}
                        className={`py-2 ${
                          index !== transposedDentalHealthData.length - 1
                            ? "border-b border-gray-300"
                            : ""
                        }`}
                      >
                        <div className="font-semibold text-gray-800">
                          {row.Header}:
                        </div>
                        {row.rows.map((cell, idx) => (
                          <div key={idx} className="text-gray-700">
                            {cell}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="border border-gray-300 rounded-lg shadow-md bg-white min-h-[400px] max-h-[400px] overflow-auto resize-x min-w-[300px] w-fit max-w-[350px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white p-4 ">
                    Health Service Area
                  </h3>
                  <div className="space-y-2 p-4 ">
                    {transposedHealthServiceAreaData.map((row, index) => (
                      <div
                        key={index}
                        className={`py-2 ${
                          index !== transposedHealthServiceAreaData.length - 1
                            ? "border-b border-gray-300"
                            : ""
                        }`}
                      >
                        <div className="font-semibold text-gray-800">
                          {row.Header}:
                        </div>
                        {row.rows.map((cell, idx) => (
                          <div key={idx} className="text-gray-700">
                            {cell}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="border border-gray-300 rounded-lg shadow-md bg-white min-h-[400px] max-h-[400px] overflow-auto resize-x min-w-[300px] w-fit max-w-[350px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white p-4 ">
                    Planning Area
                  </h3>
                  <div className="space-y-2 p-4 ">
                    {transposedLAServicePlanningData.map((row, index) => (
                      <div
                        key={index}
                        className={`py-2 ${
                          index !== transposedLAServicePlanningData.length - 1
                            ? "border-b border-gray-300"
                            : ""
                        }`}
                      >
                        <div className="font-semibold text-gray-800">
                          {row.Header}:
                        </div>
                        {row.rows.map((cell, idx) => (
                          <div key={idx} className="text-gray-700">
                            {cell}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {searchResults?.assembly?.length > 0 && (
                <div className="relative">
                  <div className="border border-gray-300 rounded-lg shadow-md bg-white min-h-[400px] max-h-[400px] overflow-auto resize-x min-w-[300px] w-fit max-w-[350px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white p-4 ">
                      Assembly District
                    </h3>
                    <div className="space-y-2 p-4 ">
                      {transposedLAServicePlanningData.map((row, index) => (
                        <div
                          key={index}
                          className={`py-2 ${
                            index !== transposedLAServicePlanningData.length - 1
                              ? "border-b border-gray-300"
                              : ""
                          }`}
                        >
                          <div className="font-semibold text-gray-800">
                            {row.Header}:
                          </div>
                          {row.rows.map((cell, idx) => (
                            <div key={idx} className="text-gray-700">
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}
                      {transposedAssemblyData.map((row, index) => (
                        <div
                          key={index}
                          className={`py-2 ${
                            index !== transposedAssemblyData.length - 1
                              ? "border-b border-gray-300"
                              : ""
                          }`}
                        >
                          <div className="font-semibold text-gray-800">
                            {row.Header}:
                          </div>
                          {row.rows.map((cell, idx) => (
                            <div key={idx} className="text-gray-700">
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {searchResults?.senate?.length > 0 && (
                <div className="relative">
                  <div className="border border-gray-300 rounded-lg shadow-md bg-white min-h-[400px] max-h-[400px] overflow-auto resize-x min-w-[300px] w-fit max-w-[350px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white p-4 ">
                      Senate District
                    </h3>
                    <div className="space-y-2 p-4 ">
                      {transposedSenateData.map((row, index) => (
                        <div
                          key={index}
                          className={`py-2 ${
                            index !== transposedSenateData.length - 1
                              ? "border-b border-gray-300"
                              : ""
                          }`}
                        >
                          <div className="font-semibold text-gray-800">
                            {row.Header}:
                          </div>
                          {row.rows.map((cell, idx) => (
                            <div key={idx} className="text-gray-700">
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {searchResults?.congressional?.length > 0 && (
                <div className="relative">
                  <div className="border border-gray-300 rounded-lg shadow-md bg-white min-h-[400px] max-h-[400px] overflow-auto resize-x min-w-[300px] w-fit max-w-[350px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white p-4">
                      Congressional District
                    </h3>
                    <div className="space-y-2 p-4">
                      {transposedCongressionalData.map((row, index) => (
                        <div
                          key={index}
                          className={`py-2 ${
                            index !== transposedCongressionalData.length - 1
                              ? "border-b border-gray-300"
                              : ""
                          }`}
                        >
                          <div className="font-semibold text-gray-800">
                            {row.Header}:
                          </div>
                          {row.rows.map((cell, idx) => (
                            <div key={idx} className="text-gray-700">
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HpsaSearchPage;
