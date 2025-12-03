import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumb.css";

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="breadcrumb-container">
            <ul className="breadcrumb-list">
                {items.map((item, index) => (
                    <li key={index} className="breadcrumb-item" style={{ display: "flex", alignItems: "center" }}>
                        {item.path && index !== items.length - 1 ? (
                            <Link to={item.path} className="breadcrumb-link">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="breadcrumb-current">{item.label}</span>
                        )}

                        {index < items.length - 1 && <span className="breadcrumb-separator">›</span>}
                    </li>
                ))}
            </ul>
        </nav>

    );
}
