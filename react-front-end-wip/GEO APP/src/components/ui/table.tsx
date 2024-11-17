// components/Table.tsx

import React from "react";
import { useTable } from "react-table";

interface TableProps {
  columns: any;
  data: any;
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table
        {...getTableProps()}
        className="min-w-full border border-gray-300 bg-white rounded-lg overflow-hidden"
      >
        {/* Table Header */}
        <thead className="bg-gray-700 text-white">
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: columnKey, ...restColumnProps } =
                    column.getHeaderProps();
                  return (
                    <th
                      key={columnKey}
                      {...restColumnProps}
                      className="px-4 py-3 text-left font-semibold uppercase tracking-wider"
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>

        {/* Table Body */}
        <tbody {...getTableBodyProps()}>
          {rows.length ? (
            rows.map((row) => {
              prepareRow(row);
              const { key: rowKey, ...restRowProps } = row.getRowProps();
              return (
                <tr
                  key={rowKey}
                  {...restRowProps}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...restCellProps } =
                      cell.getCellProps();
                    return (
                      <td
                        key={cellKey}
                        {...restCellProps}
                        className="px-4 py-3 text-gray-700"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
