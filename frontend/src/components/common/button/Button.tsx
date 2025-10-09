import React from "react";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import "./Button.css";

interface ButtonProps {
    children: ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    variant?: "primary" | "secondary" | "danger" | "success" | string;
    disabled?: boolean;
    width?: string | number;
    className?: string;
    style?: CSSProperties;
}

const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false,
    width = "auto",
    className = "",
    style = {},
}: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn btn-${variant} ${className}`}
            disabled={disabled}
            style={{ width, ...style }}
        >
            {children}
        </button>
    );
};

export default Button;
