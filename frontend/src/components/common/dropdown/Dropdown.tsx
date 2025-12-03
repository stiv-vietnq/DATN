import type { CSSProperties, ChangeEvent } from "react";
import "./Dropdown.css";

interface Option {
    label: string;
    value: string | boolean;
}

interface DropdownProps {
    value: null | boolean;
    onChange: (value: boolean | null) => void;
    options: Option[];
    placeholder?: string;
    error?: string;
    style?: CSSProperties;
    disabled?: boolean;
}

const Dropdown = ({
    value,
    onChange,
    options,
    placeholder = "--Chọn tất cả--",
    error,
    style = {},
    disabled = false,
}: DropdownProps) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const val = event.target.value;
        if (val === "") onChange(null);
        else if (val === "true") onChange(true);
        else if (val === "false") onChange(false);
    };

    return (
        <div className="dropdown-wrapper">
            <select
                value={value === null ? "" : String(value)}
                onChange={handleChange}
                className={`dropdown-field ${error ? "dropdown-error" : ""}`}
                style={style}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <div className="dropdown-error-message">{error}</div>}
        </div>
    );
};

export default Dropdown;
