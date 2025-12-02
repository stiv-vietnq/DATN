import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { getAddressByUserIdAndIsDefault, getAddressesByUserId } from "../../api/address";
import { deleteCart } from "../../api/cart";
import { createMomoPayment } from "../../api/momo";
import { createPurchase, PurchaseDto, PurchaseItemDto } from "../../api/purchases";
import Loading from "../../components/common/loading/Loading";
import Textarea from "../../components/common/textarea/Textarea";
import { useToast } from "../../components/toastProvider/ToastProvider";
import AddressItem from "../user/address/AddressItem";
import "./Purchases.css";
import { createMomoPaymentMomo, createPayment, submitOrderVnPay } from "../../api/payment";
import { sendNotification } from "../../api/notification";

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

interface Address {
    id: number;
    fullName: string;
    phoneNumber: string;
    address: string;
    provinceId: string;
    districtId: string;
    wardId: string;
    defaultValue: number;
}

export default function Purchases() {
    const [loading, setLoading] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<PurchaseDto>({
        userId: Number(localStorage.getItem("userId")),
        discountId: null,
        paymentMethod: "",
        description: "",
        addressId: 0,
        items: [],
    });

    const [addressData, setAddressData] = useState<Address | null>(null);
    const [addressId, setAddressId] = useState<number | null>(null);
    const [showAddressPopup, setShowAddressPopup] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);

    const location = useLocation();
    const selectedItems: CartItem[] = location.state?.selectedItems || [];
    const navigate = useNavigate();
    const userId = Number(localStorage.getItem("userId"));
    const { t } = useTranslation();
    const { showToast } = useToast();

    useEffect(() => {
        if (userId) {
            getAddressesByUserId(userId).then((res) => {
                const addresses: Address[] = res.data;

                const defaultAddress = addresses.find(addr => addr.defaultValue === 1);

                if (defaultAddress) {
                    setAddressData(defaultAddress);
                    setAddressId(defaultAddress.id);
                    setCustomerInfo((prev) => ({ ...prev, addressId: defaultAddress.id }));
                }
                setAddresses(addresses);
            });
        }
        if (selectedItems.length > 0) {
            const items: PurchaseItemDto[] = selectedItems.map((item) => ({
                addressId: addressId || null,
                productId: item.productDetail.productId || "",
                productDetailId: item.productDetail.id || null,
                quantity: item.quantity,
                total: String(item.total),
                totalAfterDiscount: String(item.total),
            }));
            setCustomerInfo((prev) => ({ ...prev, items }));
        }
    }, [userId, selectedItems]);

    const handleDeleteCartItem = (itemIds: number[]) => {
        setLoading(true);
        deleteCart(itemIds)
            .catch((err) => console.error("Error deleting cart items:", err))
            .finally(() => setLoading(false));
    };

    const handleBuyNow = async () => {
        if (!customerInfo.paymentMethod) {
            showToast(t("select_payment_method"), "info");
            return;
        }
        setLoading(true);

        const itemIds = selectedItems.map((item) => item.id);
        const totalVND = selectedItems.reduce((acc, item) => acc + item.total, 0);
        const VND_TO_USD_RATE = 26375.5;
        const totalUSD = (totalVND / VND_TO_USD_RATE).toFixed(2);
        let paymentSuccess = false;
        let failReason = "";

        try {
            if (customerInfo.paymentMethod === "cod") {
                paymentSuccess = true;
                failReason = "Thanh toán khi nhận hàng";
            } else if (customerInfo.paymentMethod === "momo") {
                const res = await createMomoPaymentMomo(String(totalVND));
                if (res?.data?.payUrl) {
                    window.location.href = res.data.payUrl;
                    failReason = "Thanh toán MoMo thành công";
                    return;
                } else {
                    paymentSuccess = false;
                }
            } else if (customerInfo.paymentMethod === "vnpay") {
                const res = await submitOrderVnPay("Payment for order", String(totalVND));
                if (res?.data) {
                    window.location.href = res.data;
                    failReason = "Thanh toán VNPay thành công";
                    return;
                } else {
                    paymentSuccess = false;
                }
            } else if (customerInfo.paymentMethod === "paypal") {
                const res = await createPayment("paypal", totalUSD, "USD", "Payment for order");
                if (res?.data) {
                    window.location.href = res.data;
                    failReason = "Thanh toán PayPal thành công";
                    return;
                } else {
                    paymentSuccess = false;
                }
            } else {
                showToast(t("payment_method_not_supported"), "error");
                paymentSuccess = false;
            }

            if (paymentSuccess) {
                await createPurchase([customerInfo]);
                if (itemIds.length > 0) handleDeleteCartItem(itemIds);
                const message = `Có đơn hàng mới vào lúc ${new Date().toLocaleString()}, vui lòng kiểm tra đơn hàng.`;
                await sendNotification({
                    userId: userId || 0,
                    type: "ORDER",
                    title: "Thông báo đơn hàng mới",
                    message: message,
                    failReason: failReason
                });
                navigate("/purchases-success");
            } else {
                const message = `Thanh toán thất bại, đơn hàng của bạn đặt không thành công.`;
                await sendNotification({
                    userId: userId || 0,
                    type: "ORDER_FAILED",
                    title: "Thông báo đơn hàng",
                    message: message,
                    failReason: "Thanh toán thất bại"
                });
                showToast("Thanh toán không thành công", "error");
                navigate("/purchase-notify");
            }
        } catch (err) {
            showToast("Đã xảy ra lỗi khi mua hàng", "error");
            navigate("/purchase-notify");
        } finally {
            setLoading(false);
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setCustomerInfo({ ...customerInfo, description: value });
    };

    const handleSelectAddress = (addr: Address) => {
        setAddressId(addr.id);
        setAddressData(addr);
        setCustomerInfo({ ...customerInfo, addressId: addr.id });
        setShowAddressPopup(false);
    };

    const handleNavigateAddress = () => {
        navigate("/user/address");
    }

    if (loading) return <Loading />;

    return (
        <div className="main-content-cart">
            <div className="purchases-main">
                <div className="checkout-container">
                    <div className="checkout-left">
                        <div className="info-title">{t("customer_info")}</div>
                        <div className="form-grid description-box">
                            <div className="description-label">{t("shipping_address")}</div>
                            <div className="address-item-box">
                                {addressData ? (
                                    <div className="address-header-item" style={{ color: "#ccc" }}>
                                        <div className="address-info-item">
                                            <div className="address-info-name">{addressData.fullName}</div>
                                            <div className="address-info-phone" style={{ color: "#ccc" }}>
                                                {addressData.phoneNumber}
                                            </div>
                                        </div>
                                        <div className="address-body-item" style={{ textAlign: "left" }}>
                                            <AddressItem addr={addressData} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="address-header-item" style={{ color: "#999" }}>
                                        {t("please_add_address")}{" "}
                                        <a onClick={handleNavigateAddress} style={{ color: "#007bff", textDecoration: "underline", cursor: "pointer" }}>
                                            {t("add_now")}
                                        </a>
                                    </div>
                                )}

                                {addressData && (
                                    <div
                                        className="change-address-link"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowAddressPopup(true)}
                                    >
                                        <FaEdit /> {t('edit')}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-grid description-box">
                            <div className="description-label">{t("payment_method")}:</div>
                            <select
                                value={customerInfo.paymentMethod}
                                onChange={(e) =>
                                    setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })
                                }
                            >
                                <option value="">{t("select_payment_method")}</option>
                                <option value="cod">{t("payment_cod")}</option>
                                <option value="momo">{t("payment_momo")}</option>
                                <option value="vnpay">{t("payment_vnpay")}</option>
                                <option value="paypal">{t("payment_paypal")}</option>
                            </select>
                        </div>

                        <div className="form-grid description-box" style={{ width: '97%' }}>
                            <div className="description-label">{t("note")}</div>
                            <Textarea
                                placeholder={t("description_placeholder")}
                                value={customerInfo.description}
                                onChange={handleDescriptionChange}
                            />
                        </div>

                        <button className="btn next" onClick={handleBuyNow}>
                            {t("payment")}
                        </button>

                        {showAddressPopup && (
                            <div className="address-popup-overlay">
                                <div className="address-popup">
                                    <div className="address-popup-header">
                                        <div className="address-popup-title">{t("select_address_title")}</div>
                                        <div className="address-popup-close">
                                            <FaX onClick={() => setShowAddressPopup(false)} />
                                        </div>
                                    </div>
                                    <div className="address-popup-content-list">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                className={`address-item-popup ${addressId === addr.id ? "selected" : ""}`}
                                                onClick={() => handleSelectAddress(addr)}
                                            >
                                                <div className="address-header-item">
                                                    <div className="address-info-item">
                                                        <div className="address-info-name">{addr.fullName}</div>
                                                        <div className="address-info-phone">{addr.phoneNumber}</div>
                                                    </div>
                                                    <div className="address-body-item" style={{ textAlign: "left" }}>
                                                        <AddressItem addr={addr} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="checkout-right">
                        <div className="info-title">{t("product")}</div>
                        {selectedItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-info">
                                    <img
                                        src={item.productDetail.directoryPath}
                                        alt={item.productDetail.name}
                                        className="cart-img"
                                    />
                                </div>
                                <div style={{ width: '80%' }}>
                                    <div className="cart-name" style={{ marginBottom: '20px' }}>
                                        {item.productDetail.name}
                                    </div>
                                    <div className="cart-info" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div className="cart-quantity">{t("quantity")}: {item.quantity}</div>
                                        <div className="cart-total-purchase">{t("price")}: {item.total}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="cart-total">
                            <span>{t("total_price")}: </span>
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
