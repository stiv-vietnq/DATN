import React, { useEffect, useRef, useState } from "react";
import { FaUpload, FaX } from "react-icons/fa6";
import "./ImageUpload.css";

interface ImageUploadProps {
    onChange: (file: File | null) => void;
    initialPreview?: string;
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    initialPreview,
    disabled = false,
}) => {
    const [preview, setPreview] = useState<string | null>(initialPreview || null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (initialPreview) setPreview(initialPreview);
    }, [initialPreview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setPreview(URL.createObjectURL(file));
            onChange(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; 
        }
    };

    return (
        <div className={`image-upload ${disabled ? "disabled" : ""}`}>
            {preview ? (
                <div className="image-preview">
                    <img src={preview} alt="Preview" />
                    {!disabled && (
                        <button type="button" className="remove-btn" onClick={handleRemove}>
                            <FaX />
                        </button>
                    )}
                </div>
            ) : (
                !disabled && (
                    <label className="upload-box">
                        <FaUpload className="upload-icon" />
                        <span>Chọn ảnh thương hiệu</span>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            hidden
                            disabled={disabled}
                        />
                    </label>
                )
            )}
        </div>
    );
};

export default ImageUpload;
