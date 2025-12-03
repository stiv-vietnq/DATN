import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { sendNotification } from "../../../api/notification";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userId = Number(localStorage.getItem("userId"));

  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    const message = `Thanh toán thành công vào lúc ${new Date().toLocaleString()}, đơn hàng của bạn đã được ghi nhận.`;

    sendNotification({
      userId: userId || 0,
      type: "ORDER",
      title: "Thông báo đơn hàng mới",
      message: message,
      failReason: "Thanh toán thành công",
    });
  }, []);

  const handleGoHome = () => navigate("/");
  const handleViewOrder = () => navigate("/user/purchases");

  return (
    <div className="ps-container">
      <div className="ps-card">
        <h2>{t("payment_success")}</h2>
        <p>{t("payment_success_message")}</p>

        <div className="ps-actions">
          <button className="ps-btn primary" onClick={handleViewOrder}>
            {t("view_order")}
          </button>

          <button className="ps-btn" onClick={handleGoHome}>
            {t("go_home")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
