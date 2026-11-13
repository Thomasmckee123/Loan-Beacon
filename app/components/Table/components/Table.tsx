"use client";

import { KeyboardEvent, useId } from "react";
import { TableProps } from "./TableProps";

const alignClass = (align?: "left" | "right") =>
  align === "right" ? "text-right tabular-nums" : "text-left";

export default function Table<T>({
  columns,
  data,
  rowKey,
  emptyMessage = "No results found.",
  onRowClick,
  getRowBorderColor,
}: TableProps<T>) {
  const clickable = !!onRowClick;
  const hasStripe = !!getRowBorderColor;
  const idPrefix = useId();

  // Id of the element whose text names a clickable row/card (its first cell)
  const labelId = (view: "d" | "m", row: T) =>
    `${idPrefix}-${view}-${rowKey(row).replace(/\s+/g, "_")}`;

  // Enter/Space activates a focused clickable row (additive to mouse click)
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>, row: T) => {
    if (!onRowClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick(row);
    }
  };

  const focusClass = clickable
    ? "cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy-600"
    : "";

  return (
    <>
      {/* Tablet/desktop table (md and up) */}
      <div className="hidden md:block rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="max-h-[600px] overflow-auto">
          {/* border-separate so rounded first/last cells render the hover pill */}
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={`sticky top-0 z-10 bg-navy-800 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white border-navy-800 ${alignClass(col.align)} ${
                      i === 0 ? "border-l-4" : ""
                    } ${i === columns.length - 1 ? "border-r-4" : ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const stripe = getRowBorderColor?.(row);
                return (
                  <tr
                    key={rowKey(row)}
                    onClick={() => onRowClick?.(row)}
                    onKeyDown={(e) => handleKeyDown(e, row)}
                    tabIndex={clickable ? 0 : undefined}
                    aria-labelledby={clickable ? labelId("d", row) : undefined}
                    className={`group ${focusClass}`}
                  >
                    {columns.map((col, i) => (
                      <td
                        key={col.id}
                        id={i === 0 && clickable ? labelId("d", row) : undefined}
                        // White cell borders inset the light hover fill into a rounded pill
                        className={`px-5 py-2.5 align-middle border-y-4 border-white bg-white bg-clip-padding transition-colors duration-150 group-hover:bg-navy-100 group-focus-visible:bg-navy-100 ${alignClass(col.align)} ${
                          i === 0
                            ? `border-l-4 rounded-l-xl ${hasStripe && stripe ? stripe : ""}`
                            : ""
                        } ${i === columns.length - 1 ? "border-r-4 rounded-r-xl" : ""}`}
                      >
                        {col.accessor(row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-12 text-center text-gray-600"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards (below md) */}
      <div className="md:hidden max-h-[600px] overflow-y-auto space-y-3">
        {data.map((row) => {
          const stripe = getRowBorderColor?.(row);
          return (
            <div
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              onKeyDown={(e) => handleKeyDown(e, row)}
              tabIndex={clickable ? 0 : undefined}
              role={clickable ? "link" : undefined}
              aria-labelledby={clickable ? labelId("m", row) : undefined}
              className={`rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-3 transition-shadow duration-150 hover:shadow-md active:shadow-md ${focusClass} ${
                stripe ? `border-l-4 ${stripe}` : ""
              }`}
            >
              {columns.map((col, i) => (
                <div
                  key={col.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider shrink-0">
                    {col.header}
                  </span>
                  <div
                    id={i === 0 && clickable ? labelId("m", row) : undefined}
                    className="text-right"
                  >
                    {col.accessor(row)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        {data.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-600">
            {emptyMessage}
          </div>
        )}
      </div>
    </>
  );
}
