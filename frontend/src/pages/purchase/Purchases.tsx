import { useState } from "react";
import "./Purchases.css";
import PaymentTab from "./paymentTab/PaymentTab";
import { useTranslation } from "react-i18next";

export default function Purchases() {
  const [step, setStep] = useState(1);

  // --- dữ liệu lưu trữ ---
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    description: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const handleCompleteOrder = () => {
    console.log("Thông tin khách hàng:", customerInfo);
    console.log("Phương thức thanh toán:", paymentMethod);
    setStep(3);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <InfoTab
            info={customerInfo}
            setInfo={setCustomerInfo}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <PaymentTab
            onNext={handleCompleteOrder}
            onBack={() => setStep(1)}
            setSelectedPayment={setPaymentMethod}
            selectedPayment={paymentMethod}
          />
        );
      case 3:
        return <CompleteTab onBack={() => setStep(2)} />;
      default:
        return null;
    }
  };

  return (
    <div className="main-content-cart">
      <div className="purchases-main">
        <div className="checkout-container">
          <div className="checkout-left">
            <StepHeader step={step} />
            {renderStepContent()}
          </div>

          <div className="checkout-right">
            <h3>Giỏ hàng</h3>
            <div className="cart-item">
              <img
                src="https://via.placeholder.com/100"
                alt="Sản phẩm"
                className="cart-img"
              />
              <div className="cart-info">
                <p className="cart-name">Đệm Foam Tempur Sensation Prima</p>
                <p className="cart-size">160 × 200 × 19cm</p>
                <p className="cart-price">73.680.000đ</p>
              </div>
            </div>
            <div className="cart-total">
              <span>Tổng cộng:</span>
              <strong>73.680.000đ</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StepHeader = ({ step }: { step: number }) => {
  const { t } = useTranslation();
  return (
    <div className="step-header">
      {[t("info"), t("buy"), t("complete")].map((label, index) => (
        <div key={index} className="step-item">
          <div className={`step-circle ${step >= index + 1 ? "active" : ""}`}>
            {index + 1}
          </div>
          <p className={`step-label ${step >= index + 1 ? "active" : ""}`}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
};

// ----- Tab 1 -----
const InfoTab = ({
  info,
  setInfo,
  onNext,
}: {
  info: any;
  setInfo: (val: any) => void;
  onNext: () => void;
}) => {
  const { t } = useTranslation();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInfo((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="info-title">{t("customer_info")}</div>
      <div className="form-grid">
        <input
          type="text"
          name="name"
          placeholder={t("name_placeholder")}
          value={info.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder={t("phone_placeholder")}
          value={info.phone}
          onChange={handleChange}
        />
      </div>
      <div className="form-grid" style={{ marginTop: "15px" }}>
        <input
          type="email"
          name="email"
          placeholder={t("email_placeholder")}
          value={info.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-grid" style={{ marginTop: "15px" }}>
        <input
          type="text"
          name="address"
          placeholder={t("address_placeholder")}
          value={info.address}
          onChange={handleChange}
        />
      </div>

      <div className="form-grid description-box">
        <textarea
          name="description"
          placeholder={t("description_placeholder")}
          value={info.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <button
        className="btn next"
        onClick={onNext}
        disabled={!info.name || !info.phone || !info.address || !info.email}
      >
        {t("next_1")}
      </button>
    </div>
  );
};

// ----- Tab 3 -----
const CompleteTab = ({ onBack }: { onBack: () => void }) => (
  <div className="complete-tab">
    <h3>✅ Đặt hàng thành công!</h3>
    <p>
      Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ để xác nhận đơn hàng sớm
      nhất.
    </p>
    <button className="btn back" onClick={onBack}>
      Quay lại
    </button>
  </div>
);
