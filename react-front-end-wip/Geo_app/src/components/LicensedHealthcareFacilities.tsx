"use client";

import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table2";

const ROWS_PER_PAGE = 20;

type FacilityData = {
  hcai_id: string;
  facility_id: string;
  facility: string;
  alias: string;
  city: string;
  state: string;
  zipcode: string;
  county: string;
  status: string;
  teaching_hospital: boolean;
  rural_hospital: boolean;
  dsh: boolean;
};

const tableColumns = [
  { Header: "HCAI ID", accessor: "hcai_id" },
  { Header: "Facility ID", accessor: "facility_id" },
  { Header: "Facility", accessor: "facility" },
  { Header: "Alias", accessor: "alias" },
  { Header: "City", accessor: "city" },
  { Header: "State", accessor: "state" },
  { Header: "ZipCode", accessor: "zipcode" },
  { Header: "County", accessor: "county" },
  { Header: "Status", accessor: "status" },
  { Header: "Teaching Hospital", accessor: "teaching_hospital" },
  { Header: "Rural Hospital", accessor: "rural_hospital" },
  { Header: "DSH", accessor: "dsh" },
];

const LicensedHealthcareFacilities: React.FC = () => {
  const [tableData, setTableData] = useState<FacilityData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(tableColumns.map((col) => [col.accessor, ""]))
  );

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
      } catch (error) {
        console.error("Error loading XLSX data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return tableData.filter((row) =>
      tableColumns.every((col) => {
        const value = filters[col.accessor];
        if (!value) return true;
        const rowValue = row[col.accessor as keyof FacilityData];
        return rowValue?.toString().toLowerCase().includes(value.toLowerCase());
      })
    );
  }, [tableData, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredData.slice(start, start + ROWS_PER_PAGE);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);

  return (
    <main className="container mx-auto pt-5 px-4 space-y-4">
      <section className="border border-gray-300 dark:border-gray-700 dark:bg-[#2f3136] bg-white rounded-lg p-4 shadow-md overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-200 dark:bg-[#36393f] text-black dark:text-white">
                    {tableColumns.map((col) => (
                      <TableHead
                        key={col.accessor}
                        className="p-3 text-left text-sm font-semibold"
                      >
                        <div className="flex flex-col items-center w-full">
                          <span className="whitespace-nowrap">
                            {col.Header}
                          </span>
                          <Input
                            placeholder={`Search ${col.Header}`}
                            value={filters[col.accessor]}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                [col.accessor]: e.target.value,
                              }))
                            }
                            className="w-full px-2 py-1 mt-1 rounded text-sm text-black dark:text-white dark:bg-[#202225] dark:placeholder-gray-400 border dark:border-gray-600"
                          />
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row, index) => (
                    <TableRow
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white dark:bg-[#2f3136]"
                          : "bg-gray-50 dark:bg-[#202225] hover:bg-gray-100 dark:hover:bg-[#2a2d31]"
                      }`}
                    >
                      {tableColumns.map((col) => (
                        <TableCell
                          key={col.accessor}
                          className="p-3 truncate text-sm text-black dark:text-gray-200"
                        >
                          {typeof row[col.accessor as keyof FacilityData] ===
                          "boolean"
                            ? row[col.accessor as keyof FacilityData]
                              ? "true"
                              : "false"
                            : row[col.accessor as keyof FacilityData]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        </div>

            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm font-medium dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default LicensedHealthcareFacilities;
