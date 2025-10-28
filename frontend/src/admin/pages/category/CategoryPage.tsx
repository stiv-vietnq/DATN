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

export interface CategoryType {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
  description: string;
  status: boolean;
  brand: string;
}

const CategoryPage = () => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [modalCategoryId, setModalCategoryId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "delete" | "status" | null
  >(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([
    {
      id: 1,
      name: "Danh mục 1",
      description: "Mô tả danh mục 1",
      createdDate: "2025-10-01",
      updatedDate: "2025-10-05",
      status: true,
      brand: "Thương hiệu A",
    },
    {
      id: 2,
      name: "Danh mục 2",
      description: "Mô tả danh mục 2",
      createdDate: "2025-09-20",
      updatedDate: "2025-09-25",
      status: true,
      brand: "Thương hiệu B",
    },
    {
      id: 3,
      name: "Danh mục 3",
      description: "Mô tả danh mục 3",
      createdDate: "2025-08-15",
      updatedDate: "2025-08-20",
      status: true,
      brand: "Thương hiệu C",
    },
    {
      id: 4,
      name: "Danh mục 4",
      description: "Mô tả danh mục 4",
      createdDate: "2025-07-12",
      updatedDate: "2025-07-15",
      status: true,
      brand: "Thương hiệu D",
    },
    {
      id: 5,
      name: "Danh mục 5",
      description: "Mô tả danh mục 5",
      createdDate: "2025-07-01",
      updatedDate: "2025-07-05",
      status: true,
      brand: "Thương hiệu E",
    },
  ]);
  const [totalItems, setTotalItems] = useState(categories?.length);

  //   const handleSearch = () => {
  //     const params = {
  //       name: name.trim() || "",
  //       status: selected !== null ? selected : null,
  //     };

  //     searchCategory(params)
  //       .then((response) => {
  //         setCategories(response?.data);
  //         setTotalItems(response?.data.length || 0);
  //       })
  //       .catch((error) => {
  //         console.error("Lỗi khi tìm kiếm danh mục:", error);
  //         alert("Không thể tìm kiếm danh mục!");
  //       });
  //   };

  useEffect(() => {
    // handleSearch();
  }, []);

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = categories.slice(start, end);

  const columns: BaseColumn<CategoryType>[] = [
    { key: "id", label: "ID", width: "5%" },
    { key: "name", label: "Tên danh mục", width: "15%" },
    { key: "brand", label: "Thương hiệu", width: "15%" },
    { key: "createdDate", label: "Ngày tạo", width: "10%" },
    { key: "updatedDate", label: "Ngày cập nhật", width: "10%" },
    { key: "description", label: "Mô tả", width: "25%" },
    { key: "status", label: "Trạng thái", width: "10%" },
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
      //   deleteCategory(id);
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
            <div className="header-info-category">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tìm kiếm theo tên danh mục..."
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
            <div className="header-info-category">
              <Dropdown
                value={selected}
                onChange={setSelected}
                options={[
                  { label: "Đang hoạt động", value: true },
                  { label: "Không hoạt động", value: false },
                ]}
                placeholder="--Chọn tất cả--"
                error={undefined}
                style={{ width: "50%" }}
              />
            </div>
            <div className="header-actions-category">
              <div className="button-create-category">
                <button onClick={handleAdd}>
                  <FaPlus /> Thêm mới
                </button>
              </div>
              <div className="button-export-category">
                <button
                // onClick={handleSearch}
                >
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
        />
      )}
    </div>
  );
};

export default CategoryPage;
