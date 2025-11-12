import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import {
  getAddressById,
  getAddressByUserIdAndIsDefault,
} from "../../api/address";
import AddressItem from "../user/address/AddressItem";
import "./Purchases.css";
import PaymentTab from "./paymentTab/PaymentTab";

export default function Purchases() {
  const [step, setStep] = useState(1);

  const [customerInfo, setCustomerInfo] = useState({
    userId: Number(localStorage.getItem("userId")),
    discountId: null,
    paymentMethod: "",
    description: "",
    addressId: null,
  });

  const handleCompleteOrder = () => {
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
            selectedPayment={customerInfo.paymentMethod}
            setSelectedPayment={(method: string) =>
              setCustomerInfo((prev) => ({ ...prev, paymentMethod: method }))
            }
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

  const [addressId, setAddressId] = useState<any>(null);
  const [addressDefaultId, setAddressDefaultId] = useState<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const userId = localStorage.getItem("userId");
  const [showAddressPopup, setShowAddressPopup] = useState(false);

  useEffect(() => {
    if (addressDefaultId === addressId || addressId === null) {
      handleGetAddressByUserIdAndIsDefaul();
    } else {
      getAddressById(addressId).then((response) => {
        const addressData = response?.data;
        setAddressData(addressData);
        setAddressId(addressData?.id);
      });
    }
  }, []);

  const handleGetAddressByUserIdAndIsDefaul = () => {
    getAddressByUserIdAndIsDefault(Number(userId)).then((response) => {
      const addressData = response?.data;
      setAddressDefaultId(10004);
      setAddressData(addressData);
      setAddressId(4);
    });
  };

  const handleCloseAddressPopup = () => {
    setShowAddressPopup(false);
  };

  return (
    <div>
      <div className="info-title">{t("customer_info")}</div>
      <div className="form-grid description-box">
        <div className="description-label">Địa chỉ nhận hàng:</div>
        <div className="address-item-box">
          <div className="address-header-item" style={{ color: "#ccc" }}>
            <div className="address-info-item">
              <div className="address-info-name">{addressData?.fullName}</div>
              <div className="address-info-phone" style={{ color: "#ccc" }}>
                {addressData?.phoneNumber}
              </div>
            </div>
            <div className="address-body-item" style={{ textAlign: "left" }}>
              <AddressItem addr={addressData} />
            </div>
          </div>
          <div
            className="change-address-link"
            style={{ cursor: "pointer" }}
            onClick={() => setShowAddressPopup(true)}
          >
            <FaEdit /> Sửa
          </div>
        </div>
      </div>
      <div className="form-grid description-box">
        <div className="description-label">Ghi chú:</div>
        <textarea
          name="description"
          placeholder={t("description_placeholder")}
          value={info.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <button
        className="btn next"
        onClick={() => {
          setInfo((prev: any) => {
            const updatedInfo = { ...prev, addressId: addressId };
            console.log("Địa chỉ ID được chọn:", updatedInfo.addressId);
            return updatedInfo;
          });
          onNext();
        }}
        disabled={false}
      >
        {t("next_1")}
      </button>

      {showAddressPopup && (
        <div className="address-popup-overlay">
          <div className="address-popup">
            <div className="address-popup-header">
              <div className="address-popup-title">Chọn địa chỉ nhận hàng</div>
              <div className="address-popup-close">
                <FaX onClick={handleCloseAddressPopup} />
              </div>
            </div>
            <div className="address-popup-content">vietnq</div>
          </div>
        </div>
      )}
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
