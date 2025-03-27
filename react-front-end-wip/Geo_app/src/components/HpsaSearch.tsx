"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Table from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { checkOverrideLocation, getCoordinatesFromAzure } from "@/lib/utils";
import { Search } from "@/components/ui/Search";

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

    try {
      setIsLoading(true);
      const [lat, lng] = searchQuery
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates:", lat, lng);
        setError("Invalid coordinate format. Use: lat, lng");
        addAlert("error", "Invalid coordinate format. Use: lat, lng");
        return;
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
  
  function isCoordinateFormat(input: string): boolean {
    // e.g. "13, -22" or "13.123, -22.456"
    // a quick example pattern:
    const coordRegex = /^-?\d{1,3}(\.\d+)?,\s*-?\d{1,3}(\.\d+)?$/;
    return coordRegex.test(input.trim());
  }

  const fetchResults2 = async () => {
    console.log("fetchResults function triggered.");
    setError(null);

    if (!searchQuery.trim()) {
      console.error("No search query provided.");
      setError("Please enter valid coordinates or an address.");
      addAlert("error", "Please enter valid coordinates or an address.");
      return;
    }

    try {
      setIsLoading(true);

      // 1) Check if it's coordinate
      if (isCoordinateFormat(searchQuery)) {
        console.log("Input is recognized as coordinates:", searchQuery);
        // Use existing coordinate logic
        const [lat, lng] = searchQuery.split(",").map((coord) => parseFloat(coord.trim()));
        if (isNaN(lat) || isNaN(lng)) {
          setError("Invalid coordinate format. Use: lat, lng");
          addAlert("error", "Invalid coordinate format. Use: lat, lng");
          return;
        }
        await doSearchWithCoordinates(lat, lng);

      } else {
        console.log("Input is recognized as an address:", searchQuery);
        // 2) It's an address -> check override
        const overrideData = await checkOverrideLocation(searchQuery);
        if (overrideData.found && overrideData.latitude !== undefined && overrideData.longitude !== undefined) {
          // Found in override
          console.log("Override found => lat, lng =", overrideData.latitude, overrideData.longitude);
          await doSearchWithCoordinates(overrideData.latitude, overrideData.longitude);
        } else {
          // 3) Not found in override => call Azure geocoding
          console.log("No override => calling Azure geocoding");
          const geoRes = await getCoordinatesFromAzure(searchQuery);
          if (geoRes.lat && geoRes.lng) {
            await doSearchWithCoordinates(geoRes.lat, geoRes.lng);
          } else {
            setError("Failed to geocode address. Please try again.");
            addAlert("error", "Failed to geocode address. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Failed to retrieve data.");
      addAlert("error", "Failed to retrieve data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: call your existing search route
  async function doSearchWithCoordinates(lat: number, lng: number) {
    const apiUrl = `http://localhost:8000/api/search?lat=${lat}&lng=${lng}`;
    console.log("Fetching from API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": fixedApiKey,
      },
      credentials: "include", // if you need cookies
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
  }



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

  
  const primaryCareColumns = [
    { Header: "HPSA Primary Care", accessor: "PrimaryCare" },
  ];
  const mentalHealthCareColumns = [
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
    { Header: "HPSA Dental Health", accessor: "DentalHealth" },
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

  // Table data
  const baseTableData = [
    {
      ID: searchResults?.MedicalServiceStudyArea?.length
      ? searchResults.MedicalServiceStudyArea.map(
          (item: MedicalServiceStudyAreaItem) => `${item.mssaid}`)
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
          (item: PrimaryCareShortageAreaItem) => `${item.pcsa} (${item.scoretota})`
        )
      : "N/A",    
    
      RNSA: searchResults?.RegisteredNurseShortageArea?.length
      ? searchResults.RegisteredNurseShortageArea.map((item : RegisteredNurseShortageAreaItem) => 
          `${item.rnsa} (${item.Effective})`
        )
      : "N/A",
    },
  ];

  const primaryCareData = searchResults?.PrimaryCareHPSA?.length
  ? Object.entries(searchResults.PrimaryCareHPSA[0]).map(([key, value]) => ({
      PrimaryCare: `${key}: ${value}`,
    }))
  : [{ PrimaryCare: "No Primary Care HPSA data available" }];

  const mentalHealthCareData = searchResults?.MentalHealthHPSA?.length
  ? searchResults.MentalHealthHPSA.map((item: any) => ({
      Designated: item.Designated,
      DesignatedOn: item["Designated On"],
      Ratio: item["Formal Ratio"],
      Poverty: item["Population Below Poverty"],
      Population: item["Designation Population"],
      Underserved: item["Estimated Underserved"],
      Served: item["Estimated Served"],
      Score: item["Priority Score"],
    }))
  : [{ Designated: "No Mental Health HPSA data available" }];


  const dentalHealthCareData = searchResults?.DentalHealthHPSA?.length
  ? searchResults.DentalHealthHPSA.map((item: { Designated: string }) => ({
      Designated: item.Designated,
    }))
  : [{ Designated: "No Dental Health HPSA data available" }];




  const healthServiceAreaData = searchResults?.healthservicearea?.length
  ? searchResults.healthservicearea.map(
      (item: HealthServiceAreaItem) => ({
        HealthServiceArea: `${item.hsa_name} (${item.hsa_number})`,
      })
    )
  : [{ HealthServiceArea: "N/A" }];

  const laServicePlanningAreaData = searchResults?.LaServicePlanning?.length
  ? searchResults.LaServicePlanning.map((item: { spa_name: string }) => ({
      // The property name MUST match the table column accessor "spa_name"
      spa_name: item.spa_name,
    }))
  : [
      {
        spa_name: "N/A",
      },
    ];

  const assemblyDistrictData = [
    { AssemblyDistrict: "Name: 6th Assembly District" },
    { AssemblyDistrict: "Party" },
    { AssemblyDistrict: "Website" },
  ];
  const senateDistrictData = [
    { SenateDistrict: "Name: 8th Senate District" },
    { SenateDistrict: "Party" },
    { SenateDistrict: "Website" },
  ];
  const congressionalDistrictData = [
    { CongressDistrict: "Name: 6th Congressional District" },
    { CongressDistrict: "Representative" },
    { CongressDistrict: "Party" },
    { CongressDistrict: "Website" },
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
    primaryCareData,
    [{ Header: "HPSA Primary Care", accessor: "PrimaryCare" }]
  );
  
  const transposedMentalHealthData = transposeData(
    mentalHealthCareData,
    mentalHealthCareColumns
  );
  
  
  const transposedDentalHealthData = transposeData(
    dentalHealthCareData,
    [{ Header: "HPSA Dental Health", accessor: "Designated" }]
  );
  
  const transposedHSAData = transposeData(
    searchResults?.healthservicearea?.length
      ? searchResults.healthservicearea.map(
          (item: HealthServiceAreaItem) => ({
            hsa_name: item.hsa_name,
            hsa_number: item.hsa_number,
          })
        )
      : [{
          hsa_name: "N/A",
          hsa_number: "N/A",
        }],
    healthServiceAreaColumns
  );
  

  const transposedMSSAData = transposeData(
    searchResults?.MedicalServiceStudyArea?.length
      ? searchResults.MedicalServiceStudyArea.map(
          (item: MedicalServiceStudyAreaItem) => ({
            mssaid: item.mssaid,
            definition: item.definition,
            county: item.county,
            censustract: item.censustract,
            censuskey: item.censuskey,
          })
        )
      : [{
          mssaid: "N/A",
          definition: "N/A",
          county: "N/A",
          censustract: "N/A",
          censuskey: "N/A",
        }],
    [
      { Header: "MSSA ID", accessor: "mssaid" },
      { Header: "Definition", accessor: "definition" },
      { Header: "County", accessor: "county" },
      { Header: "Census Tract", accessor: "censustract" },
      { Header: "Census Key", accessor: "censuskey" },
    ]
  );  

  const transposedPCSAData = transposeData(
    searchResults?.PrimaryCareShortageArea?.length
      ? searchResults.PrimaryCareShortageArea.map(
          (item: PrimaryCareShortageAreaItem) => ({
            pcsa: item.pcsa, scoretota:item.scoretota
          })
        )
      : [{ pcsa: "N/A", 
        scoretota:"N/A"}],
    [{ Header: "PCSA", accessor: "pcsa" },
      {Header: "Scoretota", accessor: "scoretota"}
    ]
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
   
        {/*  
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fetchResults={fetchResults2}
          isLoading={isLoading}
        />*/} 

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

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white max-h-[400px] sm:max-h-[500px] overflow-auto resize-x min-w-[300px] w-fit max-w-[800px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white">
                    Primary Health Care
                  </h3>
                  <div className="space-y-2">
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
                <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white max-h-[400px] sm:max-h-[500px] overflow-auto resize-x min-w-[300px] w-fit max-w-[800px] overflow-auto">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white">
                    Mental Health Care
                  </h3>
                  <div className="space-y-2">
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
                <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white max-h-[250px] sm:max-h-[300px] overflow-auto">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white">
                    Dental Health Care
                  </h3>
                  <div className="space-y-2">
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
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white max-h-[250px] sm:max-h-[300px] overflow-auto">
                <div className="space-y-2">
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
              <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white max-h-[250px] sm:max-h-[300px] overflow-auto">
                <div className="space-y-2">
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
            </div>
          </>
        )}

        {/* Row 3 - Using Transposed Data Needed to Make Rows Instead of Columns*/}
        <div className="w-full space-y-4">
          <div className="flex flex-wrap gap-4 pb-4">
            {searchResults?.assembly?.length > 0 && (
              <div className="relative">
                <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white max-h-[400px] sm:max-h-[500px] overflow-auto resize-x min-w-[300px] w-fit max-w-[800px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white">
                    Assembly District
                  </h3>
                  <div className="space-y-2">
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
                <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white max-h-[400px] sm:max-h-[500px] overflow-auto resize-x min-w-[300px] w-fit max-w-[800px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white">
                    Senate District
                  </h3>
                  <div className="space-y-2">
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
                <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white max-h-[400px] sm:max-h-[500px] overflow-auto resize-x min-w-[300px] w-fit max-w-[800px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 sticky top-0 bg-white">
                    Congressional District
                  </h3>
                  <div className="space-y-2">
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
        </div>
      </div>
    </>
  );
};

export default HpsaSearchPage;
