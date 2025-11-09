import type { CSSProperties, ChangeEvent } from "react";
import "./Input.css";

interface InputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  style?: CSSProperties;
  disabled?: boolean;
  length?: number;
}

const Input = ({
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  style = {},
  disabled = false,
  length,
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
        disabled={disabled}
        maxLength={length}
      />
      {error && <div className="input-error-message">{error}</div>}
    </div>
  );
};

export default Input;
