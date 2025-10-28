import React from "react";
import "./ConfirmModal.css";

interface ConfirmModalProps {
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    title = "Xác nhận hành động",
    message,
    onConfirm,
    onCancel,
    confirmText = "Đồng ý",
    cancelText = "Hủy",
}) => {
    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
                <h3 className="confirm-title">{title}</h3>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="btn-secondary" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="btn-green" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
