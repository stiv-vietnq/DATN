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
  onSelect?: (ids: number[]) => void;
  showCheckbox?: boolean;
}

function BaseTable<T extends { id: number }>({
  columns,
  data,
  onSelect,
  showCheckbox = false,
}: BaseTableProps<T>) {
  const [selected, setSelected] = React.useState<number[]>([]);

  const toggle = (id: number) => {
    const newSelected = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(newSelected);
    onSelect?.(newSelected);
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {showCheckbox && (
            <th style={{ width: "40px", borderBottom: "1px solid #ddd" }}>
              <input
                type="checkbox"
                checked={selected.length === data.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    const allIds = data.map((d) => d.id);
                    setSelected(allIds);
                    onSelect?.(allIds);
                  } else {
                    setSelected([]);
                    onSelect?.([]);
                  }
                }}
              />
            </th>
          )}
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
            {showCheckbox && (
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => toggle(item.id)}
                />
              </td>
            )}

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
