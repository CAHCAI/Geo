"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const InputWithButton: React.FC = () => (
  <div className="flex flex-col sm:flex-row w-full max-w-sm items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
    <Input
      type="text"
      placeholder="Search facilities..."
      aria-label="Search facilities"
      className=" border-gray-300 border-2 bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 text-md"
    />
    <Button
      className="bg-blue-600  hover:bg-blue-800 text-white w-full sm:w-auto text-md"
      aria-label="Search facilities"
    >
      Search
    </Button>
  </div>
);

{
  /* Defined Table Data Types */
}
type FacilityData = {
  hcai_id: string;
  facility: string;
  alias: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  county: string;
  status: string;
  teaching_hospital: string;
  rural_hospital: string;
  type: string;
  control_type: string;
  category: string;
  control_category: string;
  dsh: string;
};

{
  /* Table Column Definitions */
}
const tableColumns = [
  { Header: "HCAI ID", accessor: "hcai_id" },
  { Header: "Facility", accessor: "facility" },
  { Header: "Alias", accessor: "alias" },
  { Header: "Address", accessor: "address" },
  { Header: "City", accessor: "city" },
  { Header: "State", accessor: "state" },
  { Header: "ZipCode", accessor: "zipcode" },
  { Header: "County", accessor: "county" },
  { Header: "Status", accessor: "status" },
  { Header: "Teaching Hospital", accessor: "teaching_hospital" },
  { Header: "Rural Hospital", accessor: "rural_hospital" },
  { Header: "Type", accessor: "type" },
  { Header: "Control Type", accessor: "control_type" },
  { Header: "Category", accessor: "category" },
  { Header: "Control Category", accessor: "control_category" },
  { Header: "DSH", accessor: "dsh" },
];

{
  /* Dummy Data Section */
}
const tableData: FacilityData[] = [
  {
    hcai_id: "106010042",
    facility: "John George Psychiatric Hospital",
    alias: "",
    address: "2060 FAIRMONT DRIVE",
    city: "SAN LEANDRO",
    state: "CA",
    zipcode: "94578",
    county: "Alameda",
    status: "Open",
    teaching_hospital: "False",
    rural_hospital: "False",
    type: "General Acute Care Hospital",
    control_type: "City or County",
    category: "Hospital",
    control_category: "Government",
    dsh: "False",
  },
  {
    hcai_id: "106010735",
    facility: "Alameda Hospital",
    alias: "Alameda Hosp",
    address: "2070 CLINTON AVE",
    city: "ALAMEDA",
    state: "CA",
    zipcode: "94501",
    county: "Alameda",
    status: "Open",
    teaching_hospital: "False",
    rural_hospital: "False",
    type: "General Acute Care Hospital",
    control_type: "City or County",
    category: "Hospital",
    control_category: "Government",
    dsh: "False",
  },
  {
    hcai_id: "106010739",
    facility: "Alta Bates Summit Medical Center-Alta Bates Campus",
    alias: "Alta Bates Summit Med Ctr",
    address: "2450 ASHBY AVENUE",
    city: "BERKELEY",
    state: "CA",
    zipcode: "94705",
    county: "Alameda",
    status: "Open",
    teaching_hospital: "False",
    rural_hospital: "False",
    type: "General Acute Care Hospital",
    control_type: "Non-profit Corporation",
    category: "Hospital",
    control_category: "Nonprofit",
    dsh: "False",
  },
  {
    hcai_id: "106010811",
    facility: "Fairmont Hospital",
    alias: "Alameda Co Med Ctr, Fairmont",
    address: "15400 FOOTHILL BOULEVARD",
    city: "SAN LEANDRO",
    state: "CA",
    zipcode: "94578",
    county: "Alameda",
    status: "Open",
    teaching_hospital: "False",
    rural_hospital: "False",
    type: "General Acute Care Hospital",
    control_type: "City or County",
    category: "Hospital",
    control_category: "Government",
    dsh: "False",
  },
  {
    hcai_id: "106010844",
    facility: "Alta Bates Summit Medical Center-Herrick Campus",
    alias: "Alta Bates Summit Med Ctr - Herrick",
    address: "2001 DWIGHT WAY",
    city: "BERKELEY",
    state: "CA",
    zipcode: "94704",
    county: "Alameda",
    status: "Open",
    teaching_hospital: "False",
    rural_hospital: "False",
    type: "General Acute Care Hospital",
    control_type: "Non-profit Corporation",
    category: "Hospital",
    control_category: "Nonprofit",
    dsh: "False",
  },
];

{
  /* Filtering Section */
}
const filterData = (data: FacilityData[], filters: Record<string, string>) => {
  return data.filter((row) =>
    Object.entries(filters).every(([key, value]) =>
      value
        ? row[key as keyof FacilityData]
            ?.toLowerCase()
            .includes(value.toLowerCase())
        : true
    )
  );
};

const LicensedHealthcareFacilities: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(tableColumns.map((col) => [col.accessor, ""]))
  );

  const handleFilterChange = (accessor: string, value: string) => {
    setFilters((prev) => ({ ...prev, [accessor]: value }));
  };

  const filteredData = filterData(tableData, filters);

  return (
    <>
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white p-2 rounded"
      >
        Skip to main content
      </a>

      <header className="container mx-auto pt-5 px-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Licensed Healthcare Facilities
        </h1>
      </header>

      <main
        id="main-content"
        className="container mx-auto pt-5 px-4 space-y-4"
        tabIndex={-1}
      >
        <InputWithButton />

        {/* Table Section */}
        <section className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50 overflow-x-auto">
          <div className="w-full min-w-full sm:min-w-[1800px]">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  {tableColumns.map((col) => (
                    <th
                      key={col.accessor}
                      scope="col"
                      className="px-3 py-4 text-left font-semibold"
                    >
                      {col.Header}
                    </th>
                  ))}
                </tr>
                <tr>
                  {tableColumns.map((col) => (
                    <th key={col.accessor} className="p-2 bg-gray-100">
                      <Input
                        type="text"
                        placeholder={`Filter ${col.Header}`}
                        aria-label={`Filter by ${col.Header}`}
                        value={filters[col.accessor]}
                        onChange={(e) =>
                          handleFilterChange(col.accessor, e.target.value)
                        }
                        className="w-full px-2 py-2 border rounded text-sm"
                        style={{ minWidth: "240px" }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}
                    >
                      {tableColumns.map((col) => (
                        <td
                          key={col.accessor}
                          className="px-3 py-3 whitespace-nowrap text-base"
                        >
                          {row[col.accessor as keyof FacilityData]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="text-center p-4 text-lg"
                      aria-live="polite"
                    >
                      No matching results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
};

export default LicensedHealthcareFacilities;
