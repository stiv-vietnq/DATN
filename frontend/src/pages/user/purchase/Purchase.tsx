import { t } from "i18next";
import { useEffect, useState } from "react";
import { getPurchaseByUserId, updateStatus } from "../../../api/purchases";
import CancelOrderModal from "../../../components/common/cancelOrderModalProps/CancelOrderModalProps";
import Input from "../../../components/common/input/Input";
import "./Purchase.css";
import { FaCalendarAlt } from "react-icons/fa";
import Loading from "../../../components/common/loading/Loading";

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
  cancellationReason?: string;
  cancelledByAdmin?: boolean;
  purchaseItems: OrderItem[];
}

export default function UserPurchases() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const userId = localStorage.getItem("userId");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const reasons = [
    { value: "out_of_stock", label: "Hết hàng" },
    { value: "customer_request", label: "Khách yêu cầu" },
    { value: "payment_issue", label: "Vấn đề thanh toán" },
  ];

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
    setLoading(true);
    try {
      const response = await getPurchaseByUserId(Number(userId), searchValue, activeTab);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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

  const handleCancelOrder = (orderId: number, reason: string) => {
    setLoading(true);
    updateStatus(orderId, 5, reason, false)
      .then(() => {
        setShowConfirm(false);
        fetchOrders();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cancelling order:", error);
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="purchases-container">
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
              <div className="order-header-1">
                <div className="order-date">
                  <div className="date-icon">
                    ?
                    <div className="tooltip">
                      <div className="tooltip-title">{t('updated_latest')}</div>
                      <div className="tooltip-date">{new Date(order.updatedDate).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                {order.status === 4 && (
                  <div className="order-id">
                    {t('delivered_successfully')}
                  </div>
                )}
                <div className="order-border-right"></div>
                <div
                  className="order-status"
                  style={{ color: getStatusLabel(order.status).color }}
                >
                  {getStatusLabel(order.status).text}
                </div>
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
                          <div className="order-item-detail-total">{t('total_price')}: {item.total}₫</div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>

              <div className="order-total">
                <div className="order-actions">
                  {order.status === 5 && (
                    <div className="cancellation-reason">
                      {t('cancelled_by')} {order.cancelledByAdmin ? t('admin') : t('yourself')}
                      {order.cancellationReason && ` - ${t('reason')}: ${order.cancellationReason}`}
                    </div>
                  )}
                  <div className={order.status != 5 ? "order-total-label-1" : "order-total-label"}>
                    {t('total_price_1')}: <span className="order-total-amount">{order.purchaseItems
                      ?.reduce((sum, item) => sum + Number(item.total), 0)}
                      ₫</span>
                  </div>
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
        <CancelOrderModal
          reasons={reasons}
          onConfirm={(reason) => handleCancelOrder(selectedId, reason)}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
