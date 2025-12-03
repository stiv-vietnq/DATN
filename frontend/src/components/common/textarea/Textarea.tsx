import React from "react";
import type { CSSProperties, ChangeEvent } from "react";
import "./Textarea.css";

interface TextareaProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  style?: CSSProperties;
  rows?: number;
  disabled?: boolean;
}

const Textarea = ({
  value,
  onChange,
  placeholder,
  error,
  style = {},
  rows = 4,
  disabled = false,
}: TextareaProps) => {
  return (
    <div className="textarea-wrapper">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`textarea-field ${error ? "textarea-error" : ""}`}
        style={style}
        rows={rows}
        disabled={disabled}
      />
      {error && <div className="textarea-error-message">{error}</div>}
    </div>
  );
};

export default Textarea;
