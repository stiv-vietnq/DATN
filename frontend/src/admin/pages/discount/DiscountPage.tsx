import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { deleteDiscountById, searchDiscount, updateDiscountStatus } from "../../../api/discount";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import Dropdown from "../../../components/common/dropdown/Dropdown";
import Input from "../../../components/common/input/Input";
import Loading from "../../../components/common/loading/Loading";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, {
  BaseColumn,
} from "../../../components/table/BaseTableLayout";
import { useToast } from "../../../components/toastProvider/ToastProvider";
import DiscountModal from "./DiscountModal/DiscountModal";
import "./DiscountPage.css";

interface Discounts {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
  expiredDate: string;
  status: boolean;
  discountPercent: number;
}

const DiscountPage = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [modalDiscountId, setModalDiscountId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "delete" | "status" | null
  >(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [discounts, setDiscounts] = useState<Discounts[]>([]);
  const [totalItems, setTotalItems] = useState(discounts?.length);
  const [newStatus, setNewStatus] = useState<boolean>(false);
  const [newStatusId, setNewStatusId] = useState<number | null>(null);

  const handleSearch = () => {
    setLoading(true);
    const params = {
      name: name.trim() || "",
      status: selected !== null ? selected : null,
    };
    searchDiscount(params)
      .then((response) => {
        const data = response?.data || [];
        setDiscounts(data);
        setTotalItems(data.length || 0);
      })
      .catch(() => {
        showToast("Lỗi lấy dữ liệu giảm giá", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = discounts.slice(start, end);

  const columns: BaseColumn<Discounts>[] = [
    { key: "id", label: "ID", width: "5%" },
    { key: "name", label: "Tên giảm giá", width: "10%" },
    { key: "discountPercent", label: "Phần trăm giảm giá", width: "10%" },
    {
      key: "createdDate",
      label: "Ngày tạo",
      width: "20%",
      render: (item: Discounts) =>
        item?.createdDate
          ? new Date(item.createdDate).toLocaleString("vi-VN", {
            hour12: false,
          })
          : "",
    },
    {
      key: "updatedDate",
      label: "Ngày cập nhật",
      width: "20%",
      render: (item: Discounts) =>
        item?.updatedDate
          ? new Date(item.updatedDate).toLocaleString("vi-VN", {
            hour12: false,
          })
          : "",
    },
    {
      key: "expiredDate",
      label: "Ngày hết hạn",
      width: "20%",
      render: (item: Discounts) =>
        item?.expiredDate
          ? new Date(item.expiredDate).toLocaleString("vi-VN", {
            hour12: false,
          })
          : "",
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "15%",
      render: (item: Discounts) => (
        <span
          className={`status-label ${item.status ? "status-active" : "status-inactive"
            }`}
        >
          {item.status ? "Đang hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      width: "10%",
      render: (item: { status: any; id: any }) => (
        <div className="action-buttons">
          <FaEye
            className="action-buttons-icon"
            onClick={() => handleView(item?.id)}
          />
          <FaEdit
            className="action-buttons-icon"
            color="blue"
            onClick={() => handleEdit(item?.id)}
          />
          <FaTrash
            className="action-buttons-icon"
            color="red"
            onClick={() => openConfirm("delete", item?.id)}
          />
          {item.status ? (
            <FaToggleOn
              className="action-buttons-icon"
              color="green"
              onClick={() => handleUpdateStatus(item?.id, false)}
            />
          ) : (
            <FaToggleOff
              className="action-buttons-icon"
              color="gray"
              onClick={() => handleUpdateStatus(item?.id, true)}
            />
          )}
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalOpen(true);
    setModalMode("add");
    setModalDiscountId(null);
  };

  const handleView = (id: any) => {
    setIsModalOpen(true);
    setModalMode("view");
    setModalDiscountId(id);
  };

  const openConfirm = (action: "delete" | "status", id: number) => {
    setSelectedId(id);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const handleEdit = (id: any) => {
    setIsModalOpen(true);
    setModalMode("edit");
    setModalDiscountId(id);
  };

  const handleDelete = (id: any) => {
    deleteDiscountById(id)
      .then(() => {
        showToast("Xóa giảm giá thành công", "success");
        handleSearch();
      })
      .catch(() => {
        showToast("Lỗi khi xóa giảm giá", "error");
      })
      .finally(() => {
        setShowConfirm(false);
      });
  };

  const handleCloseModal = (shouldReload?: boolean) => {
    setIsModalOpen(false);

    if (shouldReload) {
      handleSearch();
    }
  };

  const handleUpdateStatus = (id: any, newStatus: boolean) => {
    setNewStatus(newStatus);
    setNewStatusId(id);
    setShowConfirm(true);
  };

  const updateDiscountStatusData = (id: any) => {
    setShowConfirm(false);
    updateDiscountStatus(id, newStatus).then(() => {
      showToast("Cập nhật trạng thái giảm giá thành công", "success");
      handleSearch();
    }).catch(() => {
      showToast("Lỗi khi cập nhật trạng thái giảm giá", "error");
    });
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
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tìm kiếm theo tên giảm giá ....."
                style={{ width: "100%" }}
              />
              <Dropdown
                value={selected}
                onChange={setSelected}
                options={[
                  { label: "Đang hoạt động", value: true },
                  { label: "Không hoạt động", value: false },
                ]}
                placeholder="--Chọn tất cả--"
                error={undefined}
              />
            </div>
            <div className="header-actions">
              <div className="button-create">
                <button onClick={handleAdd}>
                  <FaPlus /> Thêm mới
                </button>
              </div>
              <div className="button-export">
                <button onClick={handleSearch}>
                  {" "}
                  <FaSearch /> Tìm kiếm
                </button>
              </div>
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

      {isModalOpen && (
        <DiscountModal
          discountId={modalDiscountId}
          onClose={handleCloseModal}
          mode={modalMode}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          title={
            confirmAction === "delete"
              ? "Xác nhận xóa giảm giá"
              : "Xác nhận cập nhật trạng thái"
          }
          message={
            confirmAction === "delete"
              ? "Bạn có chắc chắn muốn xóa giảm giá này không?"
              : "Bạn có chắc chắn muốn thay đổi trạng thái giảm giá này không?"
          }
          onConfirm={() =>
            confirmAction === "delete"
              ? handleDelete(selectedId)
              : updateDiscountStatusData(newStatusId)
          }
          onCancel={() => setShowConfirm(false)}
          type="delete"
        />
      )}
    </div>
  );
};

export default DiscountPage;
