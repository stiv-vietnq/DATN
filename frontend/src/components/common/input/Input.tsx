import type { CSSProperties, ChangeEvent } from "react";
import "./Input.css";

interface InputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  style?: CSSProperties;
  disabled?: boolean; // ✅ Thêm thuộc tính disabled
}

const Input = ({
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  style = {},
  disabled = false, // ✅ Giá trị mặc định là false
}: InputProps) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? "input-error" : ""}`}
        style={style}
        disabled={disabled} // ✅ Gán vào input
      />
      {error && <div className="input-error-message">{error}</div>}
    </div>
  );
};

export default Input;
