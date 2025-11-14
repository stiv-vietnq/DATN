import { useTranslation } from "react-i18next";
import "../Purchases.css";

interface PaymentTabProps {
  onBack: () => void;
  selectedPayment: string;
  setSelectedPayment: (method: string) => void;
  onCODPayment: () => void;
  onOnlinePayment: () => void;
}

const PaymentTab = ({
  onBack,
  selectedPayment,
  setSelectedPayment,
  onCODPayment,
  onOnlinePayment,
}: PaymentTabProps) => {
  const { t } = useTranslation();

  const handlePayClick = () => {
    if (selectedPayment === "cod") {
      onCODPayment();
    } else if (selectedPayment) {
      onOnlinePayment();
    }
  };

  return (
    <div>
      <div className="info-title">{t("payment_method")}</div>
      <div className="payment-options">
        {[
          { label: t("cod_payment"), value: "cod" },
          { label: t("vnpay_payment"), value: "vnpay" },
          { label: t("momo_payment"), value: "momo" },
          { label: t("paypal_payment"), value: "paypal" },
        ].map((item) => (
          <div
            key={item.value}
            className={`payment-options-item ${
              selectedPayment === item.value ? "selected" : ""
            }`}
            onClick={() => setSelectedPayment(item.value)}
          >
            <input
              type="radio"
              name="payment"
              className="input-radio"
              checked={selectedPayment === item.value}
              onChange={() => setSelectedPayment(item.value)}
            />
            <div>{item.label}</div>
          </div>
        ))}
      </div>

      <div className="btn-group">
        <button className="btn back" onClick={onBack}>
          {t("back")}
        </button>
        <button className="btn next" onClick={handlePayClick} disabled={!selectedPayment}>
          {t("pay")}
        </button>
      </div>
    </div>
  );
};

export default PaymentTab;
