"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import Table from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const InputWithButton: React.FC = () => (
  <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
    <Input type="address" placeholder="2020 W El Camino Ave, Sacramento CA" />
    <Button>Search</Button>
  </div>
);

const HpsaSearchPage: React.FC = () => {
  // Column definitions
  const [
    baseTableColumns,
    primaryCareColumns,
    mentalHealthCareColumns,
    dentalHealthCareColumns,
    healthServiceAreaColumns,
    laServicePlanningAreaColumns,
    assemblyDistrictColumns,
    senateDistrictColumns,
    congressionalDistrictColumns,
  ] = React.useMemo(
    () => [
      [
        { Header: "MSSA ID", accessor: "ID" },
        { Header: "MSSA Definition", accessor: "Definition" },
        { Header: "Census Tract", accessor: "Tract" },
        { Header: "Census Key", accessor: "Key" },
        { Header: "County", accessor: "County" },
        { Header: "MUA", accessor: "MUA" },
        { Header: "MUP", accessor: "MUP" },
        { Header: "PCSA", accessor: "PCSA" },
        { Header: "RNSA", accessor: "RNSA" },
      ],
      [{ Header: "HPSA Primary Care", accessor: "PrimaryCare" }],
      [{ Header: "HPSA Mental Health", accessor: "MentalHealth" }],
      [{ Header: "HPSA Dental Health", accessor: "DentalHealth" }],
      [{ Header: "Health Service Area", accessor: "HealthServiceArea" }],
      [{ Header: "LA Service Planning Area", accessor: "LAServiceArea" }],
      [{ Header: "Assembly District", accessor: "AssemblyDistrict" }],
      [{ Header: "Senate District", accessor: "SenateDistrict" }],
      [{ Header: "Congressional District", accessor: "CongressDistrict" }],
    ],
    []
  );

  // Table data
  const [
    baseTableData,
    primaryCareData,
    mentalHealthCareData,
    dentalHealthCareData,
    healthServiceAreaData,
    laServicePlanningAreaData,
    assemblyDistrictData,
    senateDistrictData,
    congressionalDistrictData,
  ] = React.useMemo(
    () => [
      [
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
      ],
      // Primary Care
      [{ PrimaryCare: "Designated: No" }],
      // Mental Health
      [
        { MentalHealth: "Source Id: 7061261199" },
        { MentalHealth: "Designated: Yes" },
        { MentalHealth: "Designated on: 3/25/2021" },
        { MentalHealth: "Formal ratio" },
        { MentalHealth: "Population below poverty (%): 13.3" },
        { MentalHealth: "Designation population: 63651.0" },
        { MentalHealth: "Estimated underserved population: 63651" },
        { MentalHealth: "Estimated served population: 0" },
        { MentalHealth: "Priority score: 18" },
      ],
      // Dental Health
      [{ DentalHealth: "Designated: No" }],
      // Health Service Area
      [{ HealthServiceArea: "Golden Empire (2)" }],
      // LA Service Planning Area
      [{ LAServiceArea: "N/A" }],
      // Assembly District
      [
        { AssemblyDistrict: "Name: 6th Assembly District" },
        { AssemblyDistrict: "Party" },
        { AssemblyDistrict: "Website" },
      ],
      // Senate District
      [
        { SenateDistrict: "Name: 8th Senate District" },
        { SenateDistrict: "Party" },
        { SenateDistrict: "Website" },
      ],
      // Congressional District
      [
        { CongressDistrict: "Name: 6th Congressional District" },
        { CongressDistrict: "Representative" },
        { CongressDistrict: "Party" },
        { CongressDistrict: "Website" },
      ],
    ],
    []
  );

  return (
    <div className="container mx-auto pt-5">
      <InputWithButton />

      {/* Table Container */}
      <div className="border border-gray-700 rounded-lg p-4">
        {/* Base Table */}
        <div className="border border-gray-700 rounded-lg p-4 mb-6">
          <Table columns={baseTableColumns} data={baseTableData} />
        </div>

        {/* Row 1 Container */}
        <div className="border border-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 ">
            <div>
              <Table columns={primaryCareColumns} data={primaryCareData} />
            </div>
            <div>
              <Table
                columns={mentalHealthCareColumns}
                data={mentalHealthCareData}
              />
            </div>
            <div>
              <Table
                columns={dentalHealthCareColumns}
                data={dentalHealthCareData}
              />
            </div>
          </div>
        </div>

        {/* Row 2 Container */}
        <div className="border border-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 ">
            <div>
              <Table
                columns={healthServiceAreaColumns}
                data={healthServiceAreaData}
              />
            </div>
            <div>
              <Table
                columns={laServicePlanningAreaColumns}
                data={laServicePlanningAreaData}
              />
            </div>
          </div>
        </div>

        {/* Row 3 Container */}
        <div className="border border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-3 ">
            <div>
              <Table
                columns={assemblyDistrictColumns}
                data={assemblyDistrictData}
              />
            </div>
            <div>
              <Table
                columns={senateDistrictColumns}
                data={senateDistrictData}
              />
            </div>
            <div>
              <Table
                columns={congressionalDistrictColumns}
                data={congressionalDistrictData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HpsaSearchPage;
