/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./Cart.css";
import { useTranslation } from "react-i18next";
import { changeQuantityAndTotal, deleteCart, getAllCartsByUserId } from "../../api/cart";
import { FaTrash } from "react-icons/fa6";
import Loading from "../../components/common/loading/Loading";
import { FaShoppingCart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";


interface CartItem {
    id: number;
    total: number;
    quantity: number;
    productDetail: {
        name: string;
        directoryPath: string;
        price: number;
    };
}

export default function Cart() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem("userId");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const autoSelectId = location.state?.autoSelectId;

    useEffect(() => {
        if (autoSelectId) {
            setSelectedIds([autoSelectId]);
        }
    }, [autoSelectId]);

    useEffect(() => {
        handleGetCartItemsByUserId();
    }, []);

    const toggleSelectAll = (): void => {
        if (selectedIds.length === cartItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(cartItems.map((item) => item.id));
        }
    };

    const toggleItem = (itemId: number): void => {
        if (selectedIds.includes(itemId)) {
            setSelectedIds(selectedIds.filter((id) => id !== itemId));
        } else {
            setSelectedIds([...selectedIds, itemId]);
        }
    };

    const removeSelected = (): void => {
        if (selectedIds.length === 0) return;
        setShowConfirm(true);
    };

    const handleDelete = (itemId: number): void => {
        setShowConfirm(true);
        setSelectedIds([itemId]);
    }

    const confirmDelete = () => {
        deleteCartItem(selectedIds);
        setSelectedIds([]);
        setShowConfirm(false);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    const handleGetCartItemsByUserId = (): void => {
        setLoading(true);
        if (!userId) return;
        getAllCartsByUserId(Number(userId), "", true).then((response) => {
            setCartItems(response.data || []);
        }).catch((error) => {
            console.error("Error fetching cart items:", error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const totalPrice = cartItems
        .filter((item) => selectedIds.includes(item.id))
        .reduce((sum, item) => sum + item.total, 0);

    const selectedCount = selectedIds.length;

    const changeQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: newQuantity, total: newQuantity * item.productDetail.price }
                    : item
            )
        );

        changeQuantityAndTotal(itemId, newQuantity, (newQuantity * cartItems?.find(item => item.id === itemId)?.productDetail.price!).toString())
    };

    const deleteCartItem = (itemIds: number[]) => {
        setLoading(true);
        deleteCart(itemIds).then(() => {
            handleGetCartItemsByUserId();
        }).catch((error) => {
            console.error("Error deleting cart items:", error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleBuyNow = () => {
        if (selectedIds.length === 0) return;
        const selectedItems = cartItems.filter(item => selectedIds.includes(item.id));
        navigate("/purchases", { state: { selectedItems } });
    };

    if (loading) return <Loading />;

    return (
        <div className="main-content-cart">
            <div className="cart-container">
                <div className="cart-header">
                    <div className="col-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedIds.length === cartItems.length && cartItems.length > 0}
                            onChange={toggleSelectAll}
                        />
                    </div>
                    <div className="col-image">Hình ảnh</div>
                    <div className="col-product">Sản Phẩm</div>
                    <div className="col-price">Đơn Giá</div>
                    <div className="col-quantity">Số Lượng</div>
                    <div className="col-total">Số Tiền</div>
                    <div className="col-action">Thao Tác</div>
                </div>

                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div className="shop-section" key={item.id}>
                            <div className="cart-item-main">
                                <div className="col-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => toggleItem(item.id)}
                                    />
                                </div>
                                <div className="col-image">
                                    <img
                                        src={item?.productDetail?.directoryPath}
                                        alt={item?.productDetail?.name}
                                        className="item-image"
                                    />
                                </div>
                                <div className="col-product">{item.productDetail?.name}</div>
                                <div className="col-price">{item.productDetail?.price}</div>
                                <div className="col-quantity">
                                    <button
                                        onClick={() => changeQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="btn-quantity"
                                    >
                                        -
                                    </button>
                                    <div className="quantity-value">{item.quantity}</div>
                                    <button
                                        onClick={() => changeQuantity(item.id, item.quantity + 1)}
                                        className="btn-quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="col-total">{item.total}</div>
                                <div className="col-action">
                                    <FaTrash
                                        className="icon-delete"
                                        onClick={() => handleDelete(item.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-cart">
                        <div>
                            <FaShoppingCart className="empty-cart-icon" />
                        </div>
                        <div>{t("cart_is_empty")}</div>
                    </div>
                )}


                {/* Summary */}
                <div className="cart-summary">
                    <div className="summary-left">
                        <div className="col-checkbox-summary">
                            <input
                                type="checkbox"
                                checked={selectedIds.length === cartItems.length && cartItems.length > 0}
                                onChange={toggleSelectAll}
                            />
                        </div>
                        <div>
                            {t("select_all")} (<span className="selected-count">{selectedIds.length}</span>)
                        </div>
                        <button className="btn-remove" onClick={removeSelected}>
                            {t("delete_selected")}
                        </button>
                    </div>

                    <div className="summary-right">
                        <div className="summary-total">
                            {t("total_price")} {totalPrice}( {t("product_item")}):{" "}
                            <span className="price">{selectedCount}</span>
                        </div>
                        <div>
                            <button
                                className="btn-buy"
                                disabled={cartItems?.length === 0 || selectedIds?.length === 0}
                                onClick={handleBuyNow}
                            >
                                {t("buy_now")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showConfirm && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Xác nhận xóa</h3>
                        <p>Bạn có chắc chắn muốn xóa {selectedIds.length} sản phẩm đã chọn?</p>
                        <div className="popup-actions">
                            <button className="btn-cancel" onClick={cancelDelete}>Hủy</button>
                            <button className="btn-confirm" onClick={confirmDelete}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};