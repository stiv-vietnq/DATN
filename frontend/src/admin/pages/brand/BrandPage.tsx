import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { deleteBrand, searchProductType, updateBrandStatus } from "../../../api/brand";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";
import Input from "../../../components/common/input/Input";
import Loading from "../../../components/common/loading/Loading";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, {
  BaseColumn,
} from "../../../components/table/BaseTableLayout";
import BrandModal from "./brandModal/BrandModal";
import "./BrandPage.css";
import { useToast } from "../../../components/toastProvider/ToastProvider";

interface ProductType {
  id: number;
  name: string;
  code: string;
  createdDate: string;
  updatedDate: string;
  description: string;
  status: boolean;
}

const BrandPage = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [modalBrandId, setModalBrandId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "delete" | "status" | null
  >(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [totalItems, setTotalItems] = useState(productTypes?.length);
  const { showToast } = useToast();
  const [newStatus, setNewStatus] = useState<boolean>(false);
  const [newStatusId, setNewStatusId] = useState<number | null>(null);

  const handleSearch = () => {
    setLoading(true);
    const params = {
      name: name.trim() || "",
      status: selected !== null ? selected : null,
    };

    searchProductType(params)
      .then((response) => {
        setProductTypes(response?.data);
        setTotalItems(response?.data.length || 0);
      })
      .catch(() => {
        showToast("Lỗi lấy dữ liệu thương hiệu", "error");
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
  const currentItems = productTypes.slice(start, end);

  const columns: BaseColumn<ProductType>[] = [
    { key: "id", label: "ID", width: "5%" },
    { key: "name", label: "Tên thương hiệu", width: "10%" },
    { key: "code", label: "Mã thương hiệu", width: "10%" },
    {
      key: "createdDate",
      label: "Ngày tạo",
      width: "15%",
      render: (item: ProductType) =>
        item?.createdDate
          ? new Date(item.createdDate).toLocaleString("vi-VN", {
            hour12: false,
          })
          : "",
    },
    {
      key: "updatedDate",
      label: "Ngày cập nhật",
      width: "15%",
      render: (item: ProductType) =>
        item?.updatedDate
          ? new Date(item.updatedDate).toLocaleString("vi-VN", {
            hour12: false,
          })
          : "",
    },
    { key: "description", label: "Mô tả", width: "20%" },
    {
      key: "status",
      label: "Trạng thái",
      width: "15%",
      render: (item: ProductType) => (
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
      render: (item: { id: any; status: boolean }) => (
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
    setModalBrandId(null);
  };

  const handleView = (id: any) => {
    setIsModalOpen(true);
    setModalMode("view");
    setModalBrandId(id);
  };

  const openConfirm = (action: "delete" | "status", id: number) => {
    setSelectedId(id);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const handleEdit = (id: any) => {
    setIsModalOpen(true);
    setModalMode("edit");
    setModalBrandId(id);
  };

  const handleDelete = (id: any) => {
    deleteBrand(id)
      .then(() => {
        setShowConfirm(false);
        showToast("Xóa thương hiệu thành công", "success");
        handleSearch();
      })
      .catch(() => {
        showToast("Lỗi khi xóa thương hiệu", "error");
      });
  };

  const handleCloseModal = (shouldReload?: boolean) => {
    setIsModalOpen(false);
    if (shouldReload) {
      handleSearch();
    }
  };

  const handleUpdateStatus = (id: any, status: boolean) => {
    setNewStatusId(id);
    setNewStatus(status);
    setShowConfirm(true);
  };

  const confirmUpdateStatus = () => {
    updateBrandStatus(newStatusId!, newStatus)
      .then(() => {
        showToast("Cập nhật trạng thái thương hiệu thành công", "success");
        setShowConfirm(false);
        handleSearch();
      })
      .catch(() => {
        showToast("Lỗi cập nhật trạng thái thương hiệu", "error");
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
                placeholder="Tìm kiếm theo tên thương hiệu....."
                style={{ width: "100%" }}
              />
              <StringDropdown
                value={selected}
                onChange={setSelected}
                options={[
                  { label: "Đang hoạt động", value: "true" },
                  { label: "Không hoạt động", value: "false" },
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
        />
      </Pagination>
      {isModalOpen && (
        <BrandModal
          brandId={modalBrandId}
          onClose={handleCloseModal}
          mode={modalMode}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          title={
            confirmAction === "delete"
              ? "Xác nhận xóa thương hiệu"
              : "Xác nhận cập nhật trạng thái"
          }
          message={
            confirmAction === "delete"
              ? "Bạn có chắc chắn muốn xóa thương hiệu này không?"
              : "Bạn có chắc chắn muốn thay đổi trạng thái thương hiệu này không?"
          }
          onConfirm={() =>
            confirmAction === "delete"
              ? handleDelete(selectedId)
              : confirmUpdateStatus()
          }
          onCancel={() => setShowConfirm(false)}
          type="delete"
        />
      )}
    </div>
  );
};

export default BrandPage;
