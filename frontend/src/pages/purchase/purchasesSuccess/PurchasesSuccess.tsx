import { useNavigate } from "react-router-dom";
import "./PurchasesSuccess.css";
import { useTranslation } from "react-i18next";

const PurchasesSuccess = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewOrder = () => {
    navigate("/user/purchases");
  };

  return (
    <div className="ps-container">
      <div className="ps-card">
        <h2>{t("purchase_success")}</h2>
        <p>{t("purchase-notify-message")}</p>

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

export default PurchasesSuccess;
