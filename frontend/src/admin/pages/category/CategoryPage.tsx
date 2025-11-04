import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
// import { deleteCategory, searchCategory } from "../../../api/category";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import Dropdown from "../../../components/common/dropdown/Dropdown";
import Input from "../../../components/common/input/Input";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, {
  BaseColumn,
} from "../../../components/table/BaseTableLayout";
// import CategoryModal from "./categoryModal/CategoryModal";
import "./CategoryPage.css";
import CategoryModal from "./categoryModal/CategoryModal";
import { getProductTypeByStatus } from "../../../api/brand";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";
import { searchCategory } from "../../../api/category";
import Loading from "../../../components/common/loading/Loading";

export interface CategoryType {
  id: number;
  name: string;
  code: string;
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

  const getAllBrands = () => {
    getProductTypeByStatus({ status: null })
      .then((response) => {
        const data = response?.data || [];
        console.log("Thương hiệu hoạt động:", data);

        const mappedOptions: Option[] = data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));

        setBrandOptions(mappedOptions);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thương hiệu:", error);
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
      .catch((error) => {
        console.error("Lỗi khi tìm kiếm danh mục:", error);
        alert("Không thể tìm kiếm danh mục!");
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
    { key: "name", label: "Tên danh mục", width: "15%" },
    { key: "code", label: "Mã danh mục", width: "5%" },
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
          className={`status-label ${
            item?.status ? "status-active" : "status-inactive"
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
      render: (item: { id: any }) => (
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
    try {
      alert("Đã xóa danh mục thành công!");
    } catch (err) {
      alert("Lỗi khi xóa danh mục!");
    } finally {
      setShowConfirm(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (id: any) => {
    console.log("Cập nhật trạng thái:", id);
  };

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
          showCheckbox
          onSelect={(ids: any) => console.log("Chọn:", ids)}
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
              : handleUpdateStatus(selectedId)
          }
          onCancel={() => setShowConfirm(false)}
          type="delete"
        />
      )}
    </div>
  );
};

export default CategoryPage;
