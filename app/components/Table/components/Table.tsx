"use client";

import { TableProps } from "./TableProps";

export default function Table<T>({
  columns,
  data,
  rowKey,
  emptyMessage = "No results found.",
  onRowClick,
  getRowBorderColor,
}: TableProps<T>) {
  return (
    <div className="space-y-3">
      {/* Desktop header - hidden on mobile */}
      <div
        className="hidden md:grid rounded-xl px-6 py-3 bg-navy-800 mb-1"
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

      <div className="max-h-[600px] overflow-y-auto rounded-2xl p-3 space-y-3">
        {data.map((row) => {
          const borderColor = getRowBorderColor?.(row);
          return (
            <div
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? "cursor-pointer" : ""}
            >
              {/* Desktop row */}
              <div
                className="hidden md:grid bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-3 hover:shadow-md transition-all duration-200"
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
              <div
                className={`md:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3 active:shadow-md hover:shadow-md transition-all duration-200 ${
                  borderColor ? `border-l-4 ${borderColor}` : ""
                }`}
              >
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider shrink-0">
                      {col.header}
                    </span>
                    <div className="text-right">{col.accessor(row)}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {data.length === 0 && (
        <div className="bg-white rounded-xl shadow-md px-6 py-12 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
