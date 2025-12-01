import React, { useState } from "react";
import "./CancelOrderModalProps.css";
import { useToast } from "../../toastProvider/ToastProvider";

interface CancelOrderModalProps {
    title?: string;
    reasons: { value: string; label: string }[];
    onConfirm: (reason: string) => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: "delete" | "danger";
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
    title = "Hủy đơn hàng",
    reasons,
    onConfirm,
    onCancel,
    confirmText = "Hủy đơn",
    cancelText = "Đóng",
    type = "delete",
}) => {
    const [selectedReason, setSelectedReason] = useState<string>("");
    const { showToast } = useToast();

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
                <h3 className="confirm-title">{title}</h3>
                <div className="cancel-reason-box">
                    <label htmlFor="cancel-reason">Chọn lý do hủy đơn:</label>
                    <select
                        id="cancel-reason"
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                    >
                        <option value="" disabled>
                            -- Chọn lý do --
                        </option>
                        {reasons.map((reason) => (
                            <option key={reason.label} value={reason.label}>
                                {reason.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="confirm-actions">
                    <button className="btn-secondary" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        className={type === "delete" ? "btn-red" : "btn-green"}
                        onClick={() => {
                            if (!selectedReason) {
                                showToast("Vui lòng chọn lý do hủy đơn", "info");
                                return;
                            }
                            onConfirm(selectedReason);
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;
