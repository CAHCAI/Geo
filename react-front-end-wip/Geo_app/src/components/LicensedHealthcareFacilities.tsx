"use client";

import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { FixedSizeList as List } from "react-window";
import debounce from "lodash.debounce";

type FacilityData = {
  hcai_id: string;
  facility_id: string;
  facility: string;
  alias: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  county: string;
  status: string;
  teaching_hospital: boolean; // Boolean values instead of string
  rural_hospital: boolean; // Boolean values instead of string
  license_category: string;
  control_type: string;
  license_type: string;
  control_type_category: string;
  dsh: boolean; // Boolean values instead of string
};

const tableColumns = [
  { Header: "HCAI ID", accessor: "hcai_id" },
  { Header: "Facility ID", accessor: "facility_id" },
  { Header: "Facility", accessor: "facility" },
  { Header: "Alias", accessor: "alias" },
  { Header: "Address1", accessor: "address1" },
  { Header: "Address2", accessor: "address2" },
  { Header: "City", accessor: "city" },
  { Header: "State", accessor: "state" },
  { Header: "ZipCode", accessor: "zipcode" },
  { Header: "County", accessor: "county" },
  { Header: "Status", accessor: "status" },
  { Header: "Teaching Hospital", accessor: "teaching_hospital" },
  { Header: "Rural Hospital", accessor: "rural_hospital" },
  { Header: "License Category", accessor: "license_category" },
  { Header: "Control Type", accessor: "control_type" },
  { Header: "License Type", accessor: "license_type" },
  { Header: "Control Type Category", accessor: "control_type_category" },
  { Header: "DSH", accessor: "dsh" },
];

// Updated filterData function
const filterData = (data: FacilityData[], filters: Record<string, string>) => {
  return data.filter((row) =>
    Object.entries(filters).every(([key, value]) => {
      if (value === "") return true;

      // Handle boolean columns
      if (
        key === "teaching_hospital" ||
        key === "rural_hospital" ||
        key === "dsh"
      ) {
        return row[key as keyof FacilityData] === (value === "true");
      }

      // Handle string columns
      const rowValue = row[key as keyof FacilityData];
      if (typeof rowValue === "string") {
        return rowValue.toLowerCase().includes(value.toLowerCase());
      }

      return false;
    })
  );
};

const LicensedHealthcareFacilities: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(tableColumns.map((col) => [col.accessor, ""]))
  );
  const [tableData, setTableData] = useState<FacilityData[]>([]);
  const [originalData, setOriginalData] = useState<FacilityData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/Health-Care-Facilities.xlsx");
        const blob = await response.blob();
        const workbook = XLSX.read(await blob.arrayBuffer(), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json<FacilityData>(
          workbook.Sheets[sheetName]
        );
        setTableData(jsonData);
        setOriginalData(jsonData); // Save the original data
        setIsLoading(false); // Set loading to false after data is loaded
      } catch (error) {
        console.error("Error loading XLSX data:", error);
        setIsLoading(false); // Set loading to false in case of error as well
      }
    };

    fetchData();
  }, []);

  // Debounce function for filter updates
  const handleFilterChange = debounce((accessor: string, value: string) => {
    setFilters((prev) => ({ ...prev, [accessor]: value }));
  }, 300);

  // Memoize the filtered data to avoid recalculating on each render
  const filteredData = useMemo(
    () => filterData(originalData, filters),
    [filters, originalData]
  );

  const HeaderRow = () => (
    <div className="grid grid-flow-col grid-cols-17 gap-x-4 bg-white sticky top-0 z-10 p-2 border-b border-gray-200">
      {tableColumns.map((col) => (
        <div key={col.accessor} className="min-w-[150px]">
          <label className="text-sm text-gray-700 font-bold">
            {col.Header}
          </label>
          <Input
            placeholder={`Filter ${col.Header}`}
            value={filters[col.accessor]}
            onChange={(e) => handleFilterChange(col.accessor, e.target.value)}
            className="h-8 mt-1 text-xs border-gray-400"
          />
        </div>
      ))}
    </div>
  );

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const row = filteredData[index];
    return (
      <div
        style={style}
        className={`grid grid-flow-col grid-cols-17 gap-x-4 items-center px-2 text-sm ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        } hover:bg-gray-100 border-b border-gray-200`}
      >
        {tableColumns.map((col) => (
          <span
            key={col.accessor}
            className="min-w-[150px] truncate"
            title={row[col.accessor as keyof FacilityData]?.toString()}
          >
            {/* Display boolean columns as true/false strings */}
            {typeof row[col.accessor as keyof FacilityData] === "boolean"
              ? row[col.accessor as keyof FacilityData]
                ? "true"
                : "false"
              : row[col.accessor as keyof FacilityData]}
          </span>
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto pt-5 px-4 space-y-4">
      <section className="border border-gray-300 rounded-lg p-4 shadow-md bg-white overflow-x-auto">
        <div className="w-full min-w-[1810px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <>
              <HeaderRow />
              <List
                height={600}
                itemCount={filteredData.length}
                itemSize={40}
                width="166%"
              >
                {Row}
              </List>
              {filteredData.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No facilities found matching the current filters
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default LicensedHealthcareFacilities;
