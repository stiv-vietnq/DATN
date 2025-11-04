import type { CSSProperties, ChangeEvent } from "react";
import "./Dropdown.css";

interface Option {
  id: string;
  name: string;
  code: string;
}

interface StringDropdownPropThreeProps {
  value: Option | null;
  onChange: (value: Option | null) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

const StringDropdownPropThree = ({
  value,
  onChange,
  options,
  placeholder = "--Chọn tất cả--",
  error,
  style = {},
  disabled = false,
}: StringDropdownPropThreeProps) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    const selectedOption = options.find((opt) => opt.id === val) || null;
    onChange(selectedOption);
  };

  return (
    <div className="dropdown-wrapper">
      <select
        value={value?.id ?? ""}
        onChange={handleChange}
        className={`dropdown-field ${error ? "dropdown-error" : ""}`}
        style={style}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      {error && <div className="dropdown-error-message">{error}</div>}
    </div>
  );
};

export default StringDropdownPropThree;
