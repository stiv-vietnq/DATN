import { useNavigate } from "react-router-dom";
import "./PaymentFailed.css";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { sendNotification } from "../../../api/notification";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userId = Number(localStorage.getItem("userId"));

  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    const message = `Có đơn hàng mới vào lúc ${new Date().toLocaleString()}, vui lòng kiểm tra đơn hàng.`;

    sendNotification({
      userId: userId || 0,
      type: "ORDER",
      title: "Thông báo đơn hàng mới",
      message: message,
      failReason: "Thanh toán thất bại",
    });
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="pf-container">
      <div className="pf-card">
        <h2>{t("payment_failed")}</h2>
        <p>{t("payment_failed_message")}</p>

        <div className="pf-actions">
          <button className="pf-btn" onClick={handleGoHome}>
            {t("go_home")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
