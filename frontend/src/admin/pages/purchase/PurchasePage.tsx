import { useEffect, useState } from "react";
import { FaEdit, FaExchangeAlt, FaSearch } from "react-icons/fa";
import { getAllPurchase } from "../../../api/purchases";
import { searchUsers } from "../../../api/user";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";
import Loading from "../../../components/common/loading/Loading";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, {
  BaseColumn,
} from "../../../components/table/BaseTableLayout";
import "./PurchasePage.css";
import StatusModal from "./changeStatus/ChangeStatus";

interface Option {
  label: string;
  value: string;
}

// Interface cho đơn hàng
export interface Purchase {
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
}

const PurchasePage = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [users, setUsers] = useState<Option[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(
    null
  );
  const [selectedPurchaseStatus, setSelectedPurchaseStatus] = useState<
    number | null
  >(null);

  const paymentMethodOptions = {
    cod: "Thanh toán khi nhận hàng",
    vnpay: "Thanh toán qua vnpay",
    momo: "Thanh toán qua momo",
    paypal: "Thanh toán qua paypal",
  };

  const handleSearch = () => {
    setLoading(true);
    const params = {
      userId: selectedUser ? Number(selectedUser) : 0,
      paymentMethod: selectedPaymentMethod || "",
      status: selectedStatus ? Number(selectedStatus) : 0,
    };
    getAllPurchase(params.userId, params.paymentMethod, params.status)
      .then((response) => {
        setPurchases(response.data);
        setTotalItems(response.data.length);
      })
      .finally(() => setLoading(false));
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
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleSearch();
    handleGetUser();
  }, []);

  // Tính dữ liệu cho trang hiện tại
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = purchases.slice(start, end);

  const columns: BaseColumn<Purchase>[] = [
    { key: "id", label: "ID", width: "5%" },
    {
      key: "userId",
      label: "Người dùng",
      width: "10%",
      render: (item: Purchase) => {
        const user = users.find((u) => u.value === item.userId.toString());
        return <span>{user ? user.label : item.userId}</span>;
      },
    },
    {
      key: "paymentMethod",
      label: "Phương thức thanh toán",
      width: "15%",
      render: (item: Purchase) => (
        <span>
          {paymentMethodOptions[
            item.paymentMethod as keyof typeof paymentMethodOptions
          ] || item.paymentMethod}
        </span>
      ),
    },
    {
      key: "createdDate",
      label: "Ngày tạo",
      width: "15%",
      render: (item: Purchase) =>
        item.createdDate
          ? new Date(item.createdDate).toLocaleString("vi-VN", {
              hour12: false,
            })
          : "",
    },
    {
      key: "updatedDate",
      label: "Ngày cập nhật",
      width: "15%",
      render: (item: Purchase) =>
        item.updatedDate
          ? new Date(item.updatedDate).toLocaleString("vi-VN", {
              hour12: false,
            })
          : "",
    },
    { key: "description", label: "Mô tả", width: "20%" },
    {
      key: "status",
      label: "Trạng thái",
      width: "10%",
      render: (item: Purchase) => {
        let label = "";
        let className = "";

        switch (item.status) {
          case 1:
            label = "Chờ duyệt";
            className = "status-pending";
            break;
          case 2:
            label = "Đã duyệt";
            className = "status-approved";
            break;
          case 3:
            label = "Đang xử lý";
            className = "status-processing";
            break;
          case 4:
            label = "Hoàn thành";
            className = "status-completed";
            break;
          case 5:
            label = "Đã hủy";
            className = "status-cancelled";
            break;
          default:
            label = "Không xác định";
            className = "status-unknown";
            break;
        }
        return <span className={`status-label ${className}`}>{label}</span>;
      },
    },
    {
      key: "actions",
      label: "Thao tác",
      width: "10%",
      render: (item: Purchase) => (
        <div className="action-buttons">
          {/* <FaEdit className="action-buttons-icon" color="blue" /> */}
          {item.status !== 4 && item.status !== 5 && (
            <FaExchangeAlt
              className="action-buttons-icon"
              color="orange"
              onClick={() => handleUpdateStatus(item.id, item.status)}
              style={{ cursor: "pointer" }}
              title="Chuyển trạng thái"
            />
          )}
        </div>
      ),
    },
  ];

  const handleUpdateStatus = (id: number, status: number) => {
    setSelectedPurchaseId(id);
    setSelectedPurchaseStatus(status);
    setModalOpen(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={page}
        onPageChange={setPage}
        onItemsPerPageChange={setItemsPerPage}
        showPageSizeSelector
        headerContent={
          <div className="header-content">
            <div className="header-info">
              <StringDropdown
                value={selectedUser}
                onChange={setSelectedUser}
                options={users}
                placeholder="--Chọn tất cả--"
              />
              <StringDropdown
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { label: "Chờ duyệt", value: "1" },
                  { label: "Đã duyệt", value: "2" },
                  { label: "Đang xử lý", value: "3" },
                  { label: "Hoàn thành", value: "4" },
                  { label: "Đã hủy", value: "5" },
                ]}
                placeholder="--Chọn trạng thái--"
              />
              <StringDropdown
                value={selectedPaymentMethod}
                onChange={setSelectedPaymentMethod}
                options={[
                  { label: "Thanh toán khi nhận hàng", value: "cod" },
                  { label: "Thanh toán qua vnpay", value: "vnpay" },
                  { label: "Thanh toán qua momo", value: "momo" },
                  { label: "Thanh toán qua paypal", value: "paypal" },
                ]}
                placeholder="--Chọn phương thức thanh toán--"
              />
            </div>
            <div className="header-actions">
              <button className="button-export" onClick={handleSearch}>
                <FaSearch /> Tìm kiếm
              </button>
            </div>
          </div>
        }
      >
        <BaseTable
          columns={columns}
          data={currentItems}
          showCheckbox
          onSelect={(ids: any) => console.log("Chọn:", ids)}
        />
      </Pagination>

      {modalOpen && selectedPurchaseId && (
        <StatusModal
          purchaseId={selectedPurchaseId}
          currentStatus={selectedPurchaseStatus}
          onClose={(shouldReload) => {
            setModalOpen(false);
            setSelectedPurchaseId(null);
            if (shouldReload) handleSearch();
          }}
        />
      )}
    </div>
  );
};

export default PurchasePage;
