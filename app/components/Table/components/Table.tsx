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
      <div
        className="grid rounded-xl px-3 py-3 bg-navy-800"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((col) => (
          <div
            key={col.id}
            className="text-xs font-medium text-white uppercase p-2 tracking-wider"
          >
            {col.header}
          </div>
        ))}
      </div>
      <div className="max-h-150 overflow-y-auto rounded-2xl p-4 space-y-3">
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
      </div>
      {data.length === 0 && (
        <div className="bg-white rounded-xl shadow-md px-6 py-12 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
