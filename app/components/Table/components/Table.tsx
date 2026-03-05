"use client";

import { TableProps } from "./TableProps";

export default function Table<T>({
  columns,
  data,
  rowKey,
  emptyMessage = "No results found.",
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div
        className="grid bg-navy-50 rounded-xl px-6 py-3"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((col) => (
          <div
            key={col.id}
            className="text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Rows */}
      {data.map((row) => (
        <div
          key={rowKey(row)}
          className={`grid bg-white rounded-full shadow-2xl px-6 py-5 hover:shadow-md hover:cursor-pointer transition-shadow ${onRowClick ? "cursor-pointer" : ""}`}
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
          }}
          onClick={() => onRowClick?.(row)}
        >
          {columns.map((col) => (
            <div key={col.id} className="flex items-center">
              {col.accessor(row)}
            </div>
          ))}
        </div>
      ))}

      {data.length === 0 && (
        <div className="bg-white rounded-xl shadow-md px-6 py-12 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
