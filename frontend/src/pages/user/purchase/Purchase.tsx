import { useEffect, useState } from "react";
import "./Purchase.css";
import { getPurchaseByUserId, updateStatus } from "../../../api/purchases";
import Input from "../../../components/common/input/Input";
import Button from "../../../components/common/button/Button";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";

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
    { key: "", label: "Tất cả" },
    { key: "1", label: "Chờ duyệt" },
    { key: "2", label: "Đã duyệt" },
    { key: "3", label: "Đang giao" },
    { key: "4", label: "Hoàn thành" },
    { key: "5", label: "Đã hủy" },
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
        return { text: "Chờ xác nhận", color: "#FFA500" }; // cam
      case 2:
        return { text: "Vận chuyển", color: "#1E90FF" }; // xanh dương
      case 3:
        return { text: "Chờ giao hàng", color: "#FFD700" }; // vàng
      case 4:
        return { text: "Hoàn thành", color: "#28a745" }; // xanh lá
      case 5:
        return { text: "Đã hủy", color: "#dc3545" }; // đỏ
      default:
        return { text: "Không xác định", color: "#6c757d" }; // xám
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
            <div className="empty-text">Chưa có đơn hàng nào</div>
            <div className="empty-subtext">Hãy mua sắm ngay để tạo đơn đầu tiên!</div>
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
                  Tổng tiền: <span className="order-total-amount">{order.purchaseItems
                    ?.reduce((sum, item) => sum + Number(item.total), 0)}
                    ₫</span>
                </div>
                {order.status === 1 && (
                  <div>
                    <button
                      className="btn btn-cancel"
                      onClick={() => {
                        setShowConfirm(true);
                        setSelectedId(order?.id);
                      }}
                    >
                      Hủy đơn hàng
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
          title={"Xác nhận hủy đơn hàng"}
          message={"Bạn có chắc chắn muốn hủy đơn hàng này?"}
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
