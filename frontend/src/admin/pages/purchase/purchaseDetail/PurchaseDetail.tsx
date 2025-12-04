import React, { useEffect, useState } from "react";
import "./PurchaseDetail.css";
import Loading from "../../../../components/common/loading/Loading";
import { useToast } from "../../../../components/toastProvider/ToastProvider";
import { searchUsers } from "../../../../api/user";
import { getPurchaseById } from "../../../../api/purchases";
import AddressItem from "../../../../pages/user/address/AddressItem";

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

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productDetail: {
    name: string;
    directoryPath: string;
    quantity: number;
    total: number;
    totalAfterDiscount?: number;
  };
  quantity: number;
  total: number;
  totalAfterDiscount?: number;
}

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
  address?: Address;
}


type PurchaseDetailModalProps = {
  open: boolean;
  onClose: () => void;
  purchasesId?: number;
};

interface Option {
  label: string;
  value: string;
}

const PurchaseDetailModal: React.FC<PurchaseDetailModalProps> = ({ open, onClose, purchasesId }) => {
  if (!open || !purchasesId) return null;
   const [loading, setLoading] = useState(false);
   const { showToast } = useToast();
    const [users, setUsers] = useState<Option[]>([]);
    const [data, setData] = useState<Order>({
    id: 0,
    userId: 0,
    status: 0,
    paymentMethod: "",
    description: "",
    createdDate: "",
    updatedDate: "",
    total: 0,
    purchaseItems: [],
  });
    useEffect(() => {
      handleGetPurchaseById();
      handleGetUser();
    }, []);

    const handleGetPurchaseById = () => {
      getPurchaseById(purchasesId!)
        .then((response) => {
          setData(response.data);
        })
        .catch(() => showToast("Lỗi lấy dữ liệu đơn hàng", "error"));
    };

    const paymentMethodOptions: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng",
  vnpay: "Thanh toán qua VNPAY",
  momo: "Thanh toán qua MoMo",
  paypal: "Thanh toán qua PayPal",
};


  const handleGetUser = () => {
      setLoading(true);
      searchUsers({
        username: "",
        fromDate: "",
        toDate: "",
        isActive: "",
        isLocked: "",
      })
        .then((response) => {
          const userOptions = response.data.map((user: any) => ({
            label: user.lastName + " " + user.firstName,
            value: user.id.toString(),
          }));
          setUsers(userOptions);
        })
        .catch(() => showToast("Lỗi lấy dữ liệu người dùng", "error"))
        .finally(() => setLoading(false));
    };

    const user = users.find((u) => u.value === data.userId.toString());
    console.log(data);

   if (loading) return <Loading />;

  return (
    <div className="purchase-modal-overlay">
      <div className="purchase-modal">
        <h2>Chi tiết đơn hàng</h2>

        <div className="modal-section">
          <div className="modal-title-detail">Thông tin khách hàng</div>
          <div>
              <div>Tên: {user ? user.label : data.userId}</div>
              <div>Địa chỉ: <AddressItem addr={data.address} /></div>
          </div>
        </div>

        <div className="modal-section">
         <div className="modal-title-detail">Danh sách sản phẩm</div>
          {data.purchaseItems?.map((item, index) => (
            <div key={index} className="modal-item">
              <div style={{display:'flex', width:'100%', gap:'10px'}}>
                 <div style={{display:'grid', width:'15%'}}>
                  <img
                    src={item.productDetail.directoryPath}
                    alt={item.productDetail.name}
                    style={{ width: "100%", height: "auto" }}
                  />
                 </div>
               <div style={{display:'grid', width:'65%'}}>
                 <div>{item.productDetail.name}</div>
              <div>Số lượng x {item.quantity}</div>
               </div>
              <div style={{display:'flex', width:'20%'}}>Giá: {item.total}</div>
            </div>
            </div>
          ))}
        </div>

        <div className="modal-section">
          <div className="modal-title-detail">Thông tin đơn hàng</div>
          <p><strong>Ngày tạo:</strong> {new Date(data.createdDate).toLocaleString("vi-VN")}</p>
          <p><strong>Phương thức thanh toán:</strong> {paymentMethodOptions[data.paymentMethod]}</p>
          <p><strong>Mô tả:</strong> {data.description}</p>
          {data.cancellationReason && (
            <p><strong>Lý do hủy:</strong> {data.cancellationReason}</p>
          )}
        </div>

        <button className="close-btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default PurchaseDetailModal;
