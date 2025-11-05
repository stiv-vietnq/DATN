import { useTranslation } from "react-i18next";
import "../Purchases.css";

const PaymentTab = ({
  onNext,
  onBack,
  selectedPayment,
  setSelectedPayment,
}: {
  onNext: () => void;
  onBack: () => void;
  selectedPayment: string;
  setSelectedPayment: (method: string) => void;
}) => {
  const { t } = useTranslation();
  const handleSelect = (method: string) => {
    setSelectedPayment(method);
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
            onClick={() => handleSelect(item.value)}
          >
            <input
              type="radio"
              name="payment"
              className="input-radio"
              checked={selectedPayment === item.value}
              onChange={() => handleSelect(item.value)}
            />
            <div>{item.label}</div>
          </div>
        ))}
      </div>

      <div className="btn-group">
        <button className="btn back" onClick={onBack}>
            {t("back")}
        </button>
        <button
          className="btn next"
          onClick={onNext}
          disabled={!selectedPayment}
        >
          {t("pay")}
        </button>
      </div>
    </div>
  );
};

export default PaymentTab;
