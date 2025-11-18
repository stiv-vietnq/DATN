import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import {
    getAddressByUserIdAndIsDefault
} from "../../api/address";
import { createMomoPayment } from "../../api/momo";
import { createPurchase, PurchaseDto, PurchaseItemDto } from "../../api/purchases";
import Loading from "../../components/common/loading/Loading";
import AddressItem from "../user/address/AddressItem";
import PaymentTab from "./paymentTab/PaymentTab";
import "./Purchases.css";

interface ProductDetail {
    name: string;
    directoryPath: string;
    price: number;
    color?: string;
    size?: number;
    id?: number;
    productId?: string;
}

interface CartItem {
    id: number;
    productDetail: ProductDetail;
    userId: number;
    quantity: number;
    total: number;
    createdDate: string;
    updatedDate: string;
}

export default function Purchases() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [customerInfo, setCustomerInfo] = useState<PurchaseDto>({
        userId: Number(localStorage.getItem("userId")),
        discountId: null,
        paymentMethod: "",
        description: "",
        addressId: 0,
        items: [],
    });

    const location = useLocation();
    const selectedItems: CartItem[] = location.state?.selectedItems || [];
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedItems.length > 0) {
            const items: PurchaseItemDto[] = selectedItems.map((item) => ({
                productId: item.productDetail.productId || '',
                productDetailId: item.productDetail.id || 0,
                quantity: item.quantity,
                total: String(item.total),
                totalAfterDiscount: String(item.total),
            }));
            setCustomerInfo((prev) => ({ ...prev, items }));
        }
    }, [selectedItems]);

    const handleBuyNow = () => {
        setLoading(true);
        createPurchase([customerInfo]).then(() => {
            if (customerInfo.paymentMethod === "cod") {
                navigate("/purchases-success");
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    };

    const handleOnlinePayment = () => {
        handleBuyNow();
        if (customerInfo.paymentMethod === "vnpay") {
        } else if (customerInfo.paymentMethod === "momo") {
            createMomoPayment(
                String(selectedItems.reduce((acc, item) => acc + item.total, 0))
            ).then((res) => {
                const payUrl = res?.data?.payUrl;
                if (payUrl) {
                    window.location.href = payUrl;
                }
            }).catch((err) => {
                console.error("Error creating Momo payment:", err);
            });
        } else if (customerInfo.paymentMethod === "paypal") {
        }
    }

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
                        onBack={() => setStep(1)}
                        selectedPayment={customerInfo.paymentMethod}
                        setSelectedPayment={(method: string) =>
                            setCustomerInfo((prev) => ({ ...prev, paymentMethod: method }))
                        }
                        onCODPayment={() => { handleBuyNow() }}
                        onOnlinePayment={() => { handleOnlinePayment() }}
                    />

                );
            default:
                return null;
        }
    };
    if (loading) return <Loading />;
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
                        {selectedItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={item.productDetail.directoryPath}
                                    alt={item.productDetail.name}
                                    className="cart-img"
                                />
                                <div>
                                    <div className="cart-name">{item.productDetail.name}</div>
                                    <div className="cart-info">
                                        <div className="cart-quantity">Số lượng: {item.quantity}</div>
                                        <div className="cart-total-purchase">Giá: {item.total}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="cart-total">
                            <span>Tổng cộng:</span>
                            <strong>
                                {selectedItems.reduce((acc, item) => acc + item.total, 0).toLocaleString()}đ
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----- Step Header -----
const StepHeader = ({ step }: { step: number }) => {
    const { t } = useTranslation();
    return (
        <div className="step-header">
            {[t("info"), t("buy")].map((label, index) => (
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

// ----- Info Tab -----
const InfoTab = ({
    info,
    setInfo,
    onNext,
}: {
    info: PurchaseDto;
    setInfo: (val: PurchaseDto) => void;
    onNext: () => void;
}) => {
    const { t } = useTranslation();
    const [addressData, setAddressData] = useState<any>(null);
    const [addressId, setAddressId] = useState<number | null>(null);
    const [showAddressPopup, setShowAddressPopup] = useState(false);
    const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        getAddressByUserIdAndIsDefault(userId).then((res) => {
            const data = res?.data;
            setAddressData(data);
            setAddressId(data?.id || 0);
        });
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setInfo({ ...info, description: value });
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
                    setInfo({ ...info, addressId: addressId || 0 });
                    onNext();
                }}
            >
                {t("next_1")}
            </button>

            {showAddressPopup && (
                <div className="address-popup-overlay">
                    <div className="address-popup">
                        <div className="address-popup-header">
                            <div className="address-popup-title">Chọn địa chỉ nhận hàng</div>
                            <div className="address-popup-close">
                                <FaX onClick={() => setShowAddressPopup(false)} />
                            </div>
                        </div>
                        <div className="address-popup-content">vietnq</div>
                    </div>
                </div>
            )}
        </div>
    );
};