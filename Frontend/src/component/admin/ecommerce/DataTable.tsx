// components/DataTable.tsx
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export type Column<T> = {
  /** Unique key for this column */
  key: string;
  /** What to show in the header */
  header: ReactNode;
  /** Given one row, how to render this cell */
  cell: (row: T) => ReactNode;
};

interface DataTableProps<T> {
   title: ReactNode;
  rows: T[];
  columns: Column<T>[];
  /** optional “See all” link on the right */
  seeAllHref?: string;
  seeAllText?: string;
}

export function DataTable<T>({
  title,
  rows,
  columns,
  seeAllHref,
  seeAllText,
}: DataTableProps<T>) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
       
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"
                  >
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
