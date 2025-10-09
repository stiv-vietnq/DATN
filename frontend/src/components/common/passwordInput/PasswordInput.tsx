import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 
import "./PasswordInput.css";

interface PasswordInputProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    width?: string | number;
    className?: string;
    id?: string;
}

const PasswordInput = ({
    value,
    onChange,
    placeholder = "",
    error = "",
    width = "100%",
    className = "",
    id,
}: PasswordInputProps) => {
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => setVisible((v) => !v);
    const inputId =
        id || `password-input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`pw-wrapper ${className}`} style={{ width }}>
            <div className={`pw-field-wrapper ${error ? "pw-has-error" : ""}`}>
                <input
                    id={inputId}
                    className="pw-input"
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                />

                <button
                    type="button"
                    className="pw-toggle-btn"
                    onClick={toggleVisible}
                    aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                    {visible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
            </div>

            {error && (
                <p className="pw-error-message" id={`${inputId}-error`}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default PasswordInput;
