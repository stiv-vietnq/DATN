import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { getProductTypeByStatus } from "../../../api/brand";
import { deleteCategory, searchCategory } from "../../../api/category";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";
import Input from "../../../components/common/input/Input";
import Loading from "../../../components/common/loading/Loading";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, {
  BaseColumn,
} from "../../../components/table/BaseTableLayout";
import { useToast } from "../../../components/toastProvider/ToastProvider";
import "./CategoryPage.css";
import CategoryModal from "./categoryModal/CategoryModal";

export interface CategoryType {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
  description: string;
  status: boolean;
  productType?: {
    id: number;
    name: string;
  };
}

interface Option {
  label: string;
  value: string;
}

const CategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [modalCategoryId, setModalCategoryId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "delete" | "status" | null
  >(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [brandOptions, setBrandOptions] = useState<Option[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [totalItems, setTotalItems] = useState(categories?.length);
  const { showToast } = useToast();
  const [newStatus, setNewStatus] = useState<boolean>(false);
  const [newStatusId, setNewStatusId] = useState<number | null>(null);

  const getAllBrands = () => {
    getProductTypeByStatus({ status: null })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: Option[] = data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setBrandOptions(mappedOptions);
      })
      .catch(() => {
        showToast("Lỗi khi lấy thương hiệu!", "error");
      });
  };

  const handleSearch = () => {
    setLoading(true);
    const params = {
      productTypeId: selectedBrandId,
      name: name.trim() || "",
      status: selected !== null ? selected : null,
    };
    searchCategory(params)
      .then((response) => {
        setCategories(response?.data);
        setTotalItems(response?.data.length || 0);
      })
      .catch(() => {
        showToast("Tải dữ liệu loại sản phẩm thất bại!", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllBrands();
    handleSearch();
  }, []);

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = categories.slice(start, end);

  const columns: BaseColumn<CategoryType>[] = [
    { key: "id", label: "ID", width: "5%" },
    { key: "name", label: "Tên danh mục", width: "20%" },
    {
      key: "productType",
      label: "Thương hiệu",
      width: "15%",
      render: (item: CategoryType) => {
        return item.productType?.name || "Không xác định";
      },
    },
    {
      key: "createdDate",
      label: "Ngày tạo",
      width: "15%",
      render: (item: CategoryType) =>
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
      render: (item: CategoryType) =>
        item?.updatedDate
          ? new Date(item.updatedDate).toLocaleString("vi-VN", {
            hour12: false,
          })
          : "",
    },
    { key: "description", label: "Mô tả", width: "15%" },
    {
      key: "status",
      label: "Trạng thái",
      width: "10%",
      render: (item: CategoryType) => (
        <span
          className={`status-label ${item?.status ? "status-active" : "status-inactive"
            }`}
        >
          {item?.status ? "Đang hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      width: "10%",
      render: (item: { id: any; status: boolean }) => (
        <div className="action-buttons-category">
          <FaEye
            className="action-buttons-icon-category"
            onClick={() => handleView(item?.id)}
          />
          <FaEdit
            className="action-buttons-icon-category"
            color="blue"
            onClick={() => handleEdit(item?.id)}
          />
          <FaTrash
            className="action-buttons-icon-category"
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
    setModalCategoryId(null);
  };

  const handleView = (id: any) => {
    setIsModalOpen(true);
    setModalMode("view");
    setModalCategoryId(id);
  };

  const openConfirm = (action: "delete" | "status", id: number) => {
    setSelectedId(id);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const handleEdit = (id: any) => {
    setIsModalOpen(true);
    setModalMode("edit");
    setModalCategoryId(id);
  };

  const handleDelete = (id: any) => {
    deleteCategory(id)
      .then(() => {
        setShowConfirm(false);
        showToast("Xóa loại sản phẩm thành công", "success");
        handleSearch();
      })
      .catch(() => {
        showToast("Lỗi khi xóa loại sản phẩm", "error");
      });
  };

  const handleCloseModal = (shouldReload?: boolean) => {
    setIsModalOpen(false);

    if (shouldReload) {
      handleSearch();
    }
  };
  const handleUpdateStatus = (id: any, status: boolean) => {
    setNewStatus(status);
    setNewStatusId(id);
    openConfirm("status", id);
  };

  const confirmUpdateStatus = () => {
    //   if (newStatusId === null) return;
    //   // Call API to update status
    //   // Here we assume there's an API function called updateCategoryStatus
    //   // You need to implement this function in your API layer  
  }

  if (loading) return <Loading />;

  return (
    <div className="p-4-category">
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={page}
        onPageChange={setPage}
        onItemsPerPageChange={setItemsPerPage}
        showPageSizeSelector
        headerContent={
          <div className="header-content-category">
            <div
              className="header-info-category"
              style={{ marginBottom: "-28px" }}
            >
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tìm kiếm theo tên danh mục..."
                style={{ width: "100%" }}
              />
              <StringDropdown
                value={selectedBrandId}
                onChange={setSelectedBrandId}
                options={brandOptions}
                placeholder="--Chọn thương hiệu--"
                error={undefined}
              />
              <StringDropdown
                value={selected}
                onChange={setSelected}
                options={[
                  { label: "Đang hoạt động", value: "true" },
                  { label: "Không hoạt động", value: "false" },
                ]}
                placeholder="--Chọn trạng thái hoạt động--"
                error={undefined}
                style={{ width: "100%" }}
              />
            </div>
            <div className="header-actions-category">
              <div className="button-create-category">
                <button onClick={handleAdd}>
                  <FaPlus /> Thêm mới
                </button>
              </div>
              <div className="button-export-category">
                <button onClick={handleSearch}>
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
        <CategoryModal
          categoryId={modalCategoryId}
          onClose={handleCloseModal}
          mode={modalMode}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          title={
            confirmAction === "delete"
              ? "Xác nhận xóa danh mục"
              : "Xác nhận cập nhật trạng thái"
          }
          message={
            confirmAction === "delete"
              ? "Bạn có chắc chắn muốn xóa danh mục này không?"
              : "Bạn có chắc chắn muốn thay đổi trạng thái danh mục này?"
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

export default CategoryPage;
