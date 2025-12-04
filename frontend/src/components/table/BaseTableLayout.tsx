import React from "react";

export interface BaseColumn<T> {
  key: keyof T | "actions";
  label: string;
  width?: string | number;
  render?: (item: T) => React.ReactNode;
}

interface BaseTableProps<T extends { id: number }> {
  columns: BaseColumn<T>[];
  data: T[];
}

function BaseTable<T extends { id: number }>({
  columns,
  data,
}: BaseTableProps<T>) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={String(col.key)}
              style={{
                width: col.width,
                textAlign: "center",
                borderBottom: "1px solid #ddd",
                padding: "8px",
              }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.id}>

            {columns.map((col) => (
              <td
                key={String(col.key)}
                style={{
                  width: col.width,
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {col.key === "actions"
                  ? col.render?.(item)
                  : col.render
                    ? col.render(item)
                    : (item[col.key] as React.ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BaseTable;
