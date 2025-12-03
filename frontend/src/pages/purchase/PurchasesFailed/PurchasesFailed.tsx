import { useNavigate } from "react-router-dom";
import "./PurchasesFailed.css";
import { useTranslation } from "react-i18next";

const PurchasesFailed = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetryPayment = () => {
    navigate("/cart");
  };

  return (
    <div className="pf-container">
      <div className="pf-card">
        <h2>{t("purchase_failed")}</h2>
        <p>{t("purchase_failed_message")}</p>

        <div className="pf-actions">
          <button className="pf-btn primary" onClick={handleRetryPayment}>
            {t("retry_purchase")}
          </button>
          <button className="pf-btn" onClick={handleGoHome}>
            {t("go_home")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasesFailed;
