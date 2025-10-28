import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { deleteBrand, searchProductType } from "../../../api/brand";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import Dropdown from "../../../components/common/dropdown/Dropdown";
import Input from "../../../components/common/input/Input";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, {
  BaseColumn,
} from "../../../components/table/BaseTableLayout";
import BrandModal from "./brandModal/BrandModal";
import "./BrandPage.css";

interface ProductType {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
  description: string;
  status: boolean;
}

const BrandPage = () => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [modalBrandId, setModalBrandId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"delete" | "status" | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([
    { id: 1, name: "Áo Thun", description: "Áo thun cotton co giãn 4 chiều", createdDate: "2025-10-01", updatedDate: "2025-10-05", status: true },
    { id: 2, name: "Áo Sơ Mi", description: "Áo sơ mi công sở cao cấp", createdDate: "2025-09-20", updatedDate: "2025-09-25", status: true },
    { id: 3, name: "Quần Jean", description: "Quần jean nam nữ thời trang", createdDate: "2025-08-15", updatedDate: "2025-08-20", status: true },
    { id: 4, name: "Áo Khoác", description: "Áo khoác gió chống nước", createdDate: "2025-07-12", updatedDate: "2025-07-15", status: true },
    { id: 5, name: "Đầm Nữ", description: "Đầm công sở thanh lịch", createdDate: "2025-07-01", updatedDate: "2025-07-05", status: true },
    { id: 6, name: "Giày Thể Thao", description: "Giày thể thao nam nữ", createdDate: "2025-06-20", updatedDate: "2025-06-25", status: true },
    { id: 7, name: "Túi Xách", description: "Túi xách thời trang cao cấp", createdDate: "2025-05-15", updatedDate: "2025-05-20", status: false },
    { id: 8, name: "Mũ Nón", description: "Mũ nón thời trang", createdDate: "2025-04-10", updatedDate: "2025-04-15", status: true },
    { id: 9, name: "Dép Sandal", description: "Dép sandal nữ", createdDate: "2025-03-05", updatedDate: "2025-03-10", status: false },
    { id: 10, name: "Áo Len", description: "Áo len mùa đông", createdDate: "2025-02-01", updatedDate: "2025-02-05", status: true },
    { id: 4, name: "Áo Khoác", description: "Áo khoác gió chống nước", createdDate: "2025-07-12", updatedDate: "2025-07-15", status: true },
    { id: 5, name: "Đầm Nữ", description: "Đầm công sở thanh lịch", createdDate: "2025-07-01", updatedDate: "2025-07-05", status: true },
    { id: 6, name: "Giày Thể Thao", description: "Giày thể thao nam nữ", createdDate: "2025-06-20", updatedDate: "2025-06-25", status: true },
    { id: 7, name: "Túi Xách", description: "Túi xách thời trang cao cấp", createdDate: "2025-05-15", updatedDate: "2025-05-20", status: false },
    { id: 8, name: "Mũ Nón", description: "Mũ nón thời trang", createdDate: "2025-04-10", updatedDate: "2025-04-15", status: true },
    { id: 9, name: "Dép Sandal", description: "Dép sandal nữ", createdDate: "2025-03-05", updatedDate: "2025-03-10", status: false },
    { id: 10, name: "Áo Len", description: "Áo len mùa đông", createdDate: "2025-02-01", updatedDate: "2025-02-05", status: true },
  ]);
  const [totalItems, setTotalItems] = useState(productTypes?.length);

  const handleSearch = () => {
    const params = {
      name: name.trim() || "",
      status: selected !== null ? selected : null,
    };

    searchProductType(params)
      .then((response) => {
        setProductTypes(response?.data);
        setTotalItems(response?.data.length || 0);
      })
      .catch((error) => {
        console.error("Lỗi khi tìm kiếm loại sản phẩm:", error);
        alert("Không thể tìm kiếm loại sản phẩm!");
      });
  };

  useEffect(() => {
    // handleSearch();
  }, []);

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = productTypes.slice(start, end);

  const columns: BaseColumn<ProductType>[] = [
    { key: "id", label: "ID", width: "5%" },
    { key: "name", label: "Tên sản phẩm", width: "10%" },
    { key: "createdDate", label: "Ngày tạo", width: "15%" },
    { key: "updatedDate", label: "Ngày cập nhật", width: "15%" },
    { key: "description", label: "Mô tả", width: "35%" },
    { key: "status", label: "Trạng thái", width: "10%" },
    {
      key: "actions",
      label: "Thao tác",
      width: "10%",
      render: (item: { id: any }) => (
        <div className="action-buttons">
          <FaEye className="action-buttons-icon" onClick={() => handleView(item?.id)} />
          <FaEdit className="action-buttons-icon" color="blue" onClick={() => handleEdit(item?.id)} />
          <FaTrash className="action-buttons-icon" color="red" onClick={() => openConfirm("delete", item?.id)} />
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
  }

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
    try {
      deleteBrand(id);
      alert("Đã cập nhật trạng thái thành công!");
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái!");
    } finally {
      setShowConfirm(false);
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (id: any) => {
    console.log("Cập nhật trạng thái:", id);
  }
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
                <button onClick={handleAdd}><FaPlus /> Thêm mới</button>
              </div>
              <div className="button-export">
                <button onClick={handleSearch}> <FaSearch /> Tìm kiếm</button>
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
              : "Bạn có chắc chắn muốn thay đổi trạng thái thương hiệu này?"
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

export default BrandPage;
