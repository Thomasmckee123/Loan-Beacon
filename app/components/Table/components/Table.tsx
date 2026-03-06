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
      {/* Desktop header - hidden on mobile */}
      <div
        className="hidden md:grid rounded-xl px-3 py-3 bg-navy-800"
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
            onClick={() => onRowClick?.(row)}
            className={onRowClick ? "cursor-pointer" : ""}
          >
            {/* Desktop row */}
            <div
              className="hidden md:grid bg-white rounded-full shadow-2xl px-6 py-5 hover:shadow-md transition-shadow"
              style={{
                gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              }}
            >
              {columns.map((col) => (
                <div key={col.id} className="flex items-center">
                  {col.accessor(row)}
                </div>
              ))}
            </div>

            {/* Mobile card */}
            <div className="md:hidden bg-white rounded-2xl shadow-lg p-5 space-y-3 active:shadow-md transition-shadow">
              {columns.map((col) => (
                <div key={col.id} className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider shrink-0">
                    {col.header}
                  </span>
                  <div className="text-right">
                    {col.accessor(row)}
                  </div>
                </div>
              ))}
            </div>
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
