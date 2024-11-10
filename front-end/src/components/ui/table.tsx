// components/Table.tsx

import React from "react";
import { useTable } from "react-table";

interface TableProps {
  columns: any;
  data: any;
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className="overflow-x-auto">
      <table {...getTableProps()} className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          {headerGroups.map(headerGroup => {
            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map(column => {
                  const { key: columnKey, ...restColumnProps } = column.getHeaderProps();
                  return (
                    <th
                      key={columnKey}
                      {...restColumnProps}
                      className="px-4 py-2 text-left font-semibold text-gray-700"
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white">
          {rows.map(row => {
            prepareRow(row);
            const { key: rowKey, ...restRowProps } = row.getRowProps();
            return (
              <tr key={rowKey} {...restRowProps} className="border-b">
                {row.cells.map(cell => {
                  const { key: cellKey, ...restCellProps } = cell.getCellProps();
                  return (
                    <td
                      key={cellKey}
                      {...restCellProps}
                      className="px-4 py-2 text-gray-700"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
