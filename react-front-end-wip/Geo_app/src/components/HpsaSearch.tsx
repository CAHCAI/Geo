"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Table from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const InputWithButton: React.FC<{
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  fetchResults: () => void;
  isLoading: boolean;
}> = ({ searchQuery, setSearchQuery, fetchResults, isLoading }) => (
  <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
    <Input
      type="text"
      placeholder="Enter coordinates (lat, lng)..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <Button
      className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
      onClick={fetchResults}
      disabled={isLoading} // Disable button when loading
    >
      {isLoading ? "Loading..." : "Search"}
    </Button>
  </div>
);


const HpsaSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);

  const fetchResults = async () => {
    console.log("fetchResults function triggered.");
  
    setError(null);
  
    if (!searchQuery.trim()) {
      console.error("No search query provided.");
      setError("Please enter valid coordinates.");
      return;
    }
  
    try {
      setIsLoading(true);
      const [lat, lng] = searchQuery.split(",").map(coord => parseFloat(coord.trim()));
  
      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates:", lat, lng);
        setError("Invalid coordinate format. Use: lat, lng");
        return;
      }
  
      const apiUrl = `http://localhost:8000/api/search?lat=${lat}&lng=${lng}`;
      console.log("Fetching from API:", apiUrl);
  
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      console.log("Fetched data:", data);
  
      if (Object.keys(data).length === 0 || (!data.senate && !data.assembly && !data.congressional)) {
        console.warn("No results found.");
        setError("No results found.");
      } else {
        setSearchResults(data);
        console.table(data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Failed to retrieve data.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Column definitions
  const baseTableColumns = [
    { Header: "MSSA ID", accessor: "ID" },
    { Header: "MSSA Definition", accessor: "Definition" },
    { Header: "Census Tract", accessor: "Tract" },
    { Header: "Census Key", accessor: "Key" },
    { Header: "County", accessor: "County" },
    { Header: "MUA", accessor: "MUA" },
    { Header: "MUP", accessor: "MUP" },
    { Header: "PCSA", accessor: "PCSA" },
    { Header: "RNSA", accessor: "RNSA" },
  ];

  const primaryCareColumns = [
    { Header: "HPSA Primary Care", accessor: "PrimaryCare" },
  ];
  const mentalHealthCareColumns = [
    { Header: "HPSA Mental Health", accessor: "MentalHealth" },
  ];
  const dentalHealthCareColumns = [
    { Header: "HPSA Dental Health", accessor: "DentalHealth" },
  ];
  const healthServiceAreaColumns = [
    { Header: "Health Service Area", accessor: "HealthServiceArea" },
  ];
  const laServicePlanningAreaColumns = [
    { Header: "LA Service Planning Area", accessor: "LAServiceArea" },
  ];
  const assemblyDistrictColumns = [
    { Header: "Assembly District", accessor: "district_number" },
    { Header: "District Label", accessor: "district_label" },
    { Header: "Population", accessor: "population" },
  ];
  
  const senateDistrictColumns = [
    { Header: "Senate District", accessor: "district_number" },
    { Header: "District Label", accessor: "district_label" },
    { Header: "Population", accessor: "population" },
  ];
  
  const congressionalDistrictColumns = [
    { Header: "Congressional District", accessor: "district_number" },
    { Header: "District Label", accessor: "district_label" },
    { Header: "Population", accessor: "population" },
  ];
  

  // Table data
  const baseTableData = [
    {
      ID: "139a",
      Definition: "Urban",
      Tract: "70.11",
      Key: "06067007011",
      County: "Sacramento",
      MUA: "No",
      MUP: "No",
      PCSA: "Yes (7)",
      RNSA: "No",
    },
  ];

  const primaryCareData = [{ PrimaryCare: "Designated: No" }];
  const mentalHealthCareData = [
    { MentalHealth: "Source Id: 7061261199" },
    { MentalHealth: "Designated: Yes" },
    { MentalHealth: "Designated on: 3/25/2021" },
    { MentalHealth: "Formal ratio" },
    { MentalHealth: "Population below poverty (%): 13.3" },
    { MentalHealth: "Designation population: 63651.0" },
    { MentalHealth: "Estimated underserved population: 63651" },
    { MentalHealth: "Estimated served population: 0" },
    { MentalHealth: "Priority score: 18" },
  ];

  const dentalHealthCareData = [{ DentalHealth: "Designated: No" }];
  const healthServiceAreaData = [{ HealthServiceArea: "Golden Empire (2)" }];
  const laServicePlanningAreaData = [{ LAServiceArea: "N/A" }];
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

  return (
    <div className="container mx-auto pt-5 space-y-4">
      <InputWithButton 
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      fetchResults={fetchResults}
      isLoading={isLoading} />

      {/* Base Table */}
      <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[350px] overflow-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Base Table</h3>
        <div className="overflow-x-auto">
          <Table columns={baseTableColumns} data={baseTableData} />
        </div>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[250px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Primary Care</h3>
          <Table columns={primaryCareColumns} data={primaryCareData} />
        </div>
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[250px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Mental Health Care
          </h3>
          <Table
            columns={mentalHealthCareColumns}
            data={mentalHealthCareData}
          />
        </div>
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[250px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Dental Health Care
          </h3>
          <Table
            columns={dentalHealthCareColumns}
            data={dentalHealthCareData}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[250px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Health Service Area
          </h3>
          <Table
            columns={healthServiceAreaColumns}
            data={healthServiceAreaData}
          />
        </div>
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[250px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            LA Service Planning Area
          </h3>
          <Table
            columns={laServicePlanningAreaColumns}
            data={laServicePlanningAreaData}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[250px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Assembly District
          </h3>
      <Table
      columns={assemblyDistrictColumns} 
      data={searchResults?.assembly || []}
      />
        </div>
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[250px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Senate District
          </h3>
          <Table columns={senateDistrictColumns} 
          data={searchResults?.senate || []} />
        </div>
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[250px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Congressional District
          </h3>
          <Table
            columns={congressionalDistrictColumns} 
            data={searchResults?.congressional || []}
          />
        </div>
      </div>
    </div>
  );
};

export default HpsaSearchPage;