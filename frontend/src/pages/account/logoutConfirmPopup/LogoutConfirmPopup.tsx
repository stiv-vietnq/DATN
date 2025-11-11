// src/components/common/logoutConfirm/LogoutConfirmPopup.tsx
import React from "react";
import ReactDOM from "react-dom";
import "./LogoutConfirmPopup.css";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface LogoutConfirmPopupProps {
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

const LogoutConfirmPopup: React.FC<LogoutConfirmPopupProps> = ({ onConfirm, onCancel, message }) => {
  return ReactDOM.createPortal(
    <div className="logout-popup-overlay">
      <div className="logout-popup">
        <div className="logout-popup-header">
          <div className="logout-popup-title">Xác nhận đăng xuất</div>
          <IconButton
            aria-label="close"
            size="small"
            className="logout-popup-close"
            onClick={onCancel}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="logout-popup-message">
          {message || "Bạn có chắc chắn muốn đăng xuất không?"}
        </div>

        <div className="logout-popup-buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm}
            className="logout-btn-confirm"
          >
            Đồng ý
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            className="logout-btn-cancel"
          >
            Hủy
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutConfirmPopup;
