"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import Table from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const InputWithButton: React.FC = () => (
  <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
    <Input type="address" placeholder="2020 W El Camino Ave, Sacramento CA" />
    <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white">
      Search
    </Button>
  </div>
);

const HpsaSearchPage: React.FC = () => {
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
    { Header: "Assembly District", accessor: "AssemblyDistrict" },
  ];
  const senateDistrictColumns = [
    { Header: "Senate District", accessor: "SenateDistrict" },
  ];
  const congressionalDistrictColumns = [
    { Header: "Congressional District", accessor: "CongressDistrict" },
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
      <InputWithButton />

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
            data={assemblyDistrictData}
          />
        </div>
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[250px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Senate District
          </h3>
          <Table columns={senateDistrictColumns} data={senateDistrictData} />
        </div>
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 max-h-[250px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Congressional District
          </h3>
          <Table
            columns={congressionalDistrictColumns}
            data={congressionalDistrictData}
          />
        </div>
      </div>
    </div>
  );
};

export default HpsaSearchPage;
