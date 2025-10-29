import React, { useState, useRef, useEffect } from "react";
import { FaUpload, FaX } from "react-icons/fa6";
import "./MultiImageUpload.css";

interface ExistingImage {
    id: number;
    url: string;
}

interface MultiImageUploadProps {
    onChange: (files: File[]) => void;
    onDelete?: (deletedIds: number[]) => void;
    initialImages?: ExistingImage[];
    disabled?: boolean;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
    onChange,
    onDelete,
    initialImages = [],
    disabled = false,
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>(initialImages.map((img) => img.url));
    const [existingImages, setExistingImages] = useState<ExistingImage[]>(initialImages);
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (files.length > 0) {
            const newPreviews: string[] = [];
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    newPreviews.push(reader.result as string);
                    if (newPreviews.length === files.length) {
                        setPreviews([...existingImages.map((img) => img.url), ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else if (existingImages.length === 0) {
            setPreviews([]);
        }
    }, [files]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles((prev) => [...prev, ...selectedFiles]);
        onChange([...files, ...selectedFiles]);
    };

    const handleRemove = (index: number) => {
        if (index < existingImages.length) {
            const imageToRemove = existingImages[index];
            const updatedExisting = existingImages.filter((_, i) => i !== index);
            setExistingImages(updatedExisting);

            const updatedDeleted = [...deletedIds, imageToRemove.id];
            setDeletedIds(updatedDeleted);
            onDelete?.(updatedDeleted);
        } else {
            const fileIndex = index - existingImages.length;
            const updatedFiles = files.filter((_, i) => i !== fileIndex);
            setFiles(updatedFiles);
            onChange(updatedFiles);
        }

        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
    };

    return (
        <div className={`multi-image-upload ${disabled ? "disabled" : ""}`}>
            {!disabled && (
                <label className="upload-box">
                    <FaUpload className="upload-icon" />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        hidden
                        disabled={disabled}
                    />
                </label>
            )}
            {previews.length > 0 && (
                <div className="preview-grid">
                    {previews.map((src, index) => (
                        <div key={index} className="preview-item">
                            <img src={src} alt={`Preview ${index}`} />
                            {!disabled && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => handleRemove(index)}
                                >
                                    <FaX />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiImageUpload;
