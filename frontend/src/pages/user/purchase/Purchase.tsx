import { useEffect, useState } from "react";
import "./Purchase.css";
import { getPurchaseByUserId, updateStatus } from "../../../api/purchases";
import Input from "../../../components/common/input/Input";
import Button from "../../../components/common/button/Button";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import { t } from "i18next";

// Interface cho từng sản phẩm trong đơn hàng
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productDetail: {
    name: string;
    directoryPath: string;
  };
  quantity: number;
  total: number;
  totalAfterDiscount?: number;
}

// Interface cho đơn hàng
export interface Order {
  id: number;
  userId: number;
  addressId?: number;
  status: number;
  paymentMethod: string;
  description: string;
  discountId?: number;
  firstWave?: number;
  createdDate: string;
  updatedDate: string;
  total: number;
  purchaseItems: OrderItem[];
}

export default function UserPurchases() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const userId = localStorage.getItem("userId");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);

  const tabs = [
    { key: "", label: t('all') },
    { key: "1", label: t('waiting_for_confirmation') },
    { key: "2", label: t('being_delivered') },
    { key: "3", label: t('delivering') },
    { key: "4", label: t('delivered') },
    { key: "5", label: t('cancelled') },
  ];

  useEffect(() => {
    fetchOrders();
  }, [activeTab, searchValue]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getPurchaseByUserId(Number(userId), searchValue, activeTab);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return { text: t('waiting_for_confirmation'), color: "#FFA500" };
      case 2:
        return { text: t('being_delivered'), color: "#1E90FF" };
      case 3:
        return { text: t('delivering'), color: "#FFD700" };
      case 4:
        return { text: t('delivered'), color: "#28a745" };
      case 5:
        return { text: t('cancelled'), color: "#dc3545" };
      default:
        return { text: "Không xác định", color: "#6c757d" };
    }
  };

  const handleCancelOrder = (orderId: number) => {
    updateStatus(orderId, 5)
      .then(() => {
        setShowConfirm(false);
        fetchOrders();
      })
      .catch((error) => {
        console.error("Error cancelling order:", error);
      });
  };


  return (
    <div className="purchases-container">
      {/* TABS */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="search-bar">
        <Input
          placeholder="Tìm sản phẩm…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>


      {/* ORDER LIST */}
      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">🛒</div>
            <div className="empty-text">{t('no_orders')}</div>
            <div className="empty-subtext">{t('buuy')}</div>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div
                className="order-status"
                style={{ color: getStatusLabel(order.status).color }}
              >
                {getStatusLabel(order.status).text}
              </div>
              <div className="order-items">
                {order.purchaseItems?.map((item) =>
                  item.productDetail ? (
                    <div key={item.id} className="order-item-detail">
                      <div className="order-item-detail-image">
                        <img src={item?.productDetail?.directoryPath} alt={item?.productDetail?.name} />
                      </div>
                      <div className="order-item-detail-info">
                        <div className="order-item-detail-name">{item?.productDetail?.name}</div>
                        <div className="order-item-detail-meta">
                          <div className="order-item-detail-quantity">x {item?.quantity}</div>
                          <div className="order-item-detail-total">{item.total}₫</div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>

              <div className="order-total">
                <div>
                  {t('total_price_1')}: <span className="order-total-amount">{order.purchaseItems
                    ?.reduce((sum, item) => sum + Number(item.total), 0)}
                    ₫</span>
                </div>
                {order.status === 1 && (
                  <div>
                    <button
                      className="btn-cancel-order"
                      onClick={() => {
                        setShowConfirm(true);
                        setSelectedId(order?.id);
                      }}
                    >
                      {t("cancel_order")}
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))
        )}
      </div>

      {showConfirm && (
        <ConfirmModal
          title={t("confirm_cancel_order")}
          message={t("are_you_sure_cancel_order")}
          onConfirm={() =>
            handleCancelOrder(selectedId)
          }
          onCancel={() => setShowConfirm(false)}
          type="delete"
        />
      )}
    </div>
  );
}
