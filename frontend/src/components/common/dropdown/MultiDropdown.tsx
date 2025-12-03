import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";
import Input from "../input/Input";

interface Option {
  label: string;
  value: string;
}

interface MultiDropdownProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiDropdown({
  value,
  onChange,
  options,
  placeholder = "---------Chọn---------",
  disabled = false,
}: MultiDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="multi-wrapper" ref={boxRef}>
      <div
        className={`multi-input ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && setOpen(!open)}
      >
        {value.length === 0 ? (
          <div className="placeholder">{placeholder}</div>
        ) : (
          <span className="selected-text">
            {options
              .filter((o) => value.includes(o.value))
              .map((o) => o.label)
              .join(", ")}
          </span>
        )}
      </div>

      {open && !disabled && (
        <div className="multi-dropdown">
          <div className="multi-search-box">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
            />
          </div>

          <div className="multi-options">
            {filteredOptions.length === 0 ? (
              <div className="no-data">Không có dữ liệu</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`multi-item ${
                    value.includes(opt.value) ? "selected" : ""
                  }`}
                  onClick={() => toggleValue(opt.value)}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={value.includes(opt.value)}
                      readOnly
                    />
                  </div>
                  <div>{opt.label}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
