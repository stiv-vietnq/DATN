import type { CSSProperties, ChangeEvent } from "react";
import "./Dropdown.css";

interface Option {
    label: string;
    value: string;
}

interface StringDropdownProps {
    value: string | null;
    onChange: (value: string | null) => void;
    options: Option[];
    placeholder?: string;
    error?: string;
    style?: CSSProperties;
    disabled?: boolean;
}

const StringDropdown = ({
    value,
    onChange,
    options,
    placeholder = "--Chọn tất cả--",
    error,
    style = {},
    disabled = false,
}: StringDropdownProps) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const val = event.target.value;
        onChange(val === "" ? null : val);
    };

    return (
        <div className="dropdown-wrapper">
            <select
                value={value ?? ""}
                onChange={handleChange}
                className={`dropdown-field ${error ? "dropdown-error" : ""}`}
                style={style}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <div className="dropdown-error-message">{error}</div>}
        </div>
    );
};

export default StringDropdown;
