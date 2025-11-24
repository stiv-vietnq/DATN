import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { deleteBrand, searchProductType } from "../../../api/brand";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import Input from "../../../components/common/input/Input";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, {
  BaseColumn,
} from "../../../components/table/BaseTableLayout";
import "./DiscountPage.css";
import Loading from "../../../components/common/loading/Loading";
import Dropdown from "../../../components/common/dropdown/Dropdown";
import { searchDiscount } from "../../../api/discount";
import DiscountModal from "./DiscountModal/DiscountModal";

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
      .catch((error) => {
        console.error("Lỗi khi tìm kiếm giảm giá:", error);
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
          className={`status-label ${
            item.status ? "status-active" : "status-inactive"
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
      render: (item: { id: any }) => (
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
    try {
      deleteBrand(id);
    } catch (err) {
    } finally {
      setShowConfirm(false);
    }
  };

  const handleCloseModal = (shouldReload?: boolean) => {
    setIsModalOpen(false);

    if (shouldReload) {
      handleSearch();
    }
  };

  const handleUpdateStatus = (id: any) => {
    console.log("Cập nhật trạng thái:", id);
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
              : handleUpdateStatus(selectedId)
          }
          onCancel={() => setShowConfirm(false)}
          type="delete"
        />
      )}
    </div>
  );
};

export default DiscountPage;
