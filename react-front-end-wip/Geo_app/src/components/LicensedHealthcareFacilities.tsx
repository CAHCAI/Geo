"use client";

import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { FixedSizeList as List } from "react-window";
import debounce from "lodash.debounce";

/**
 * Defines the shape of facility data parsed from the Excel file.
 */
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
  teaching_hospital: boolean;
  rural_hospital: boolean;
  license_category: string;
  control_type: string;
  license_type: string;
  control_type_category: string;
  dsh: boolean;
};

/**
 * Columns for both desktop table and mobile card layout.
 */
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

/**
 * Filters the data based on:
 *  1) Individual column filters (desktop).
 *  2) A global search string that checks all columns.
 */
function filterData(
  data: FacilityData[],
  filters: Record<string, string>,
  globalSearch: string
) {
  // First, apply column-based filters.
  let filtered = data.filter((row) =>
    Object.entries(filters).every(([key, value]) => {
      if (value === "") return true;

      if (
        key === "teaching_hospital" ||
        key === "rural_hospital" ||
        key === "dsh"
      ) {
        return row[key as keyof FacilityData] === (value === "true");
      }

      const rowValue = row[key as keyof FacilityData];
      if (typeof rowValue === "string") {
        return rowValue.toLowerCase().includes(value.toLowerCase());
      }
      return false;
    })
  );

  // Then, apply a global search if provided.
  if (globalSearch.trim()) {
    const searchLower = globalSearch.toLowerCase();
    filtered = filtered.filter((row) =>
      tableColumns.some((col) => {
        const cellValue = row[col.accessor as keyof FacilityData];
        if (typeof cellValue === "boolean") {
          return cellValue.toString().toLowerCase().includes(searchLower);
        }
        return (cellValue as string)?.toLowerCase().includes(searchLower);
      })
    );
  }

  return filtered;
}

/**
 * Highlights any substring of 'text' that matches 'search' (case-insensitive).
 */
function highlightText(text: string, search: string): React.ReactNode {
  if (!search.trim()) return text;
  const regex = new RegExp(`(${search})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

const LicensedHealthcareFacilities: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(tableColumns.map((col) => [col.accessor, ""]))
  );
  const [tableData, setTableData] = useState<FacilityData[]>([]);
  const [originalData, setOriginalData] = useState<FacilityData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearch, setGlobalSearch] = useState<string>("");

  /**
   * Loads Excel data on mount, then parses it into JSON.
   */
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/Health-Care-Facilities.xlsx");
        const blob = await response.blob();
        const workbook = XLSX.read(await blob.arrayBuffer(), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json<FacilityData>(
          workbook.Sheets[sheetName]
        );
        setTableData(jsonData);
        setOriginalData(jsonData);
      } catch (error) {
        console.error("Error loading XLSX data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  /**
   * Debounced input handler for column-based filters.
   */
  const handleFilterChange = debounce((accessor: string, value: string) => {
    setFilters((prev) => ({ ...prev, [accessor]: value }));
  }, 300);

  /**
   * Memoized filtered data for both desktop & mobile usage.
   */
  const filteredData = useMemo(
    () => filterData(originalData, filters, globalSearch),
    [filters, originalData, globalSearch]
  );

  /**
   * Renders the header row for the desktop table (with filter inputs).
   */
  const HeaderRow = () => (
    <div className="grid grid-flow-col grid-cols-17 gap-x-4 bg-white sticky top-0 z-10 p-2 border-b border-gray-200">
      {tableColumns.map((col) => (
        <div key={col.accessor} className="min-w-[150px]">
          <label className="text-sm text-gray-700 font-bold">{col.Header}</label>
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

  /**
   * Desktop table row for each item (react-window).
   */
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

  /**
   * Mobile card layout row for each item (react-window).
   */
  const CardRow = ({
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
        className={`p-4 mb-4 shadow-md rounded border ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        }`}
      >
        {tableColumns.map((col) => {
          const cellValue = row[col.accessor as keyof FacilityData];
          const text =
            typeof cellValue === "boolean"
              ? cellValue
                ? "true"
                : "false"
              : (cellValue ?? "").toString();
          return (
            <p key={col.accessor} className="text-sm text-gray-700 mb-1 break-words">
              <strong>{col.Header}:</strong> {highlightText(text, globalSearch)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <main className="container mx-auto pt-5 px-4 space-y-4">
      {/* Desktop layout */}
      <section className="hidden md:block border border-gray-300 rounded-lg p-4 shadow-md bg-white overflow-x-auto">
        <div className="w-full min-w-[1810px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <>
              <HeaderRow />
              <List height={600} itemCount={filteredData.length} itemSize={40} width="166%">
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

      {/* Mobile layout */}
      <section className="md:hidden">
        <div className="mb-4">
          <Input
            placeholder="Search..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredData.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No facilities found matching the current filters
              </div>
            ) : (
              <List height={600} itemCount={filteredData.length} itemSize={490} width="100%">
                {CardRow}
              </List>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default LicensedHealthcareFacilities;
