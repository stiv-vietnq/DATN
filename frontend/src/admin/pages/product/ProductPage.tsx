import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { getProductTypeByStatus } from "../../../api/brand";
import { getCategorysByProductTypeId } from "../../../api/category";
import { DeleteProductById, ProductSearch } from "../../../api/product";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";
import Input from "../../../components/common/input/Input";
import Loading from "../../../components/common/loading/Loading";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, {
  BaseColumn,
} from "../../../components/table/BaseTableLayout";
import ProductModal from "./productModal/ProductModal";
import "./ProductPage.css";

interface Product {
  id: number;
  productName: string;
  price: number;
  description: string;
  status: boolean;
  createdDate: string;
  updatedDate: string;
  quantitySold: number;
  percentageReduction: number;
  numberOfVisits: number;
  productType?: {
    id: number;
    name: string;
  };
  categoryId?: string;
}

interface Option {
  label: string;
  value: string;
}

const ProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [modalProductId, setModalProductId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "delete" | "status" | null
  >(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedQuantitySold, setSelectedQuantitySold] = useState<
    string | null
  >(null);
  const [selectedNumberOfVisits, setSelectedNumberOfVisits] = useState<
    string | null
  >(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(products.length);
  const [brandOptions, setBrandOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // Phân trang
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = products.slice(start, end);

  useEffect(() => {
    getAllBrands();
    handleSearchProducts();
  }, [page, itemsPerPage]);

  const handleSearchProducts = () => {
    setLoading(true);
    ProductSearch({
      productTypeId: selectedBrandId,
      name: name,
      minPrice: minPrice,
      maxPrice: maxPrice,
      status: selected,
      categoryId: selectedCategoryId,
      orderBy: "asc",
      priceOrder: "asc",
      page: 1,
      size: 10,
      quantitySold: selectedQuantitySold,
      numberOfVisits: selectedNumberOfVisits,
      evaluate: null,
    })
      .then((response) => {
        const data = response?.data || [];
        setProducts(data);
        setTotalItems(data.length);
      })
      .catch((error) => {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllBrands = () => {
    setLoading(true);
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
      })
      .finally(() => setLoading(false));
  };

  const fetchCategoriesByProductTypeId = (value: string | null) => {
    getCategorysByProductTypeId({
      productTypeId: value,
      status: null,
    })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: Option[] = data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));

        setCategoryOptions(mappedOptions);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
      });
  };

  // Columns table
  const columns: BaseColumn<Product>[] = [
    { key: "id", label: "ID", width: "5%" },
    { key: "productName", label: "Tên sản phẩm", width: "15%" },
    {
      key: "productType",
      label: "Thương hiệu",
      width: "10%",
      render: (item: Product) => {
        return item.productType?.name || "Không xác định";
      },
    },
    {
      key: "categoryId",
      label: "Danh mục",
      width: "10%",
    },
    { key: "price", label: "Giá (VNĐ)", width: "10%" },
    { key: "percentageReduction", label: "Giảm giá (%)", width: "10%" },
    { key: "numberOfVisits", label: "Lượt xem", width: "10%" },
    { key: "quantitySold", label: "Đã bán", width: "10%" },
    {
      key: "createdDate",
      label: "Ngày tạo",
      width: "10%",
      render: (item: Product) =>
        item?.createdDate
          ? new Date(item.createdDate).toLocaleString("vi-VN", {
              hour12: false,
            })
          : "",
    },
    {
      key: "updatedDate",
      label: "Ngày cập nhật",
      width: "10%",
      render: (item: Product) =>
        item?.updatedDate
          ? new Date(item.updatedDate).toLocaleString("vi-VN", {
              hour12: false,
            })
          : "",
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "10%",
      render: (item: Product) => (
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
      render: (item: Product) => (
        <div className="action-buttons-product">
          <FaEye
            className="action-buttons-icon-product"
            onClick={() => handleView(item.id)}
          />
          <FaEdit
            className="action-buttons-icon-product"
            color="blue"
            onClick={() => handleEdit(item.id)}
          />
          <FaTrash
            className="action-buttons-icon-product"
            color="red"
            onClick={() => openConfirm("delete", item.id)}
          />
        </div>
      ),
    },
  ];

  // Handlers
  const handleAdd = () => {
    setIsModalOpen(true);
    setModalMode("add");
    setModalProductId(null);
  };

  const handleView = (id: number) => {
    setIsModalOpen(true);
    setModalMode("view");
    setModalProductId(id);
  };

  const handleEdit = (id: number) => {
    setIsModalOpen(true);
    setModalMode("edit");
    setModalProductId(id);
  };

  const openConfirm = (action: "delete" | "status", id: number) => {
    setSelectedId(id);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const handleDelete = (id: number) => {
    DeleteProductById(id)
      .then(() => {
        handleSearchProducts();
      })
      .catch((error) => {
        console.error("Lỗi khi xóa sản phẩm:", error);
      });
    setShowConfirm(false);
  };

  const handleUpdateStatus = (id: number) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, status: !p.status } : p))
    );
    setShowConfirm(false);
  };

  const handleCloseModal = () => setIsModalOpen(false);

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
          <div className="header-content-product">
            <div className="header-info-product">
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "-20px" }}
              >
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  style={{ width: "100%" }}
                />
                <StringDropdown
                  value={selectedBrandId}
                  onChange={(value: string | null) => {
                    setSelectedBrandId(value);
                    if (value) {
                      fetchCategoriesByProductTypeId(value);
                    } else {
                      setSelectedCategoryId(null);
                      setCategoryOptions([]);
                    }
                  }}
                  options={brandOptions}
                  placeholder="--Chọn thương hiệu--"
                  error={undefined}
                />
                <StringDropdown
                  value={selectedCategoryId}
                  onChange={setSelectedCategoryId}
                  options={categoryOptions}
                  placeholder="--Chọn danh mục--"
                  error={undefined}
                />

                <StringDropdown
                  value={selected}
                  onChange={setSelected}
                  options={[
                    { label: "Đang hoạt động", value: "true" },
                    { label: "Không hoạt động", value: "false" },
                  ]}
                  placeholder="-- Chọn trạng thái hoạt động --"
                  error={undefined}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px", width: "50%" }}>
                  <Input
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Giá tối thiểu..."
                    style={{ width: "100%" }}
                    type="number"
                  />
                  <Input
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Giá tối đa..."
                    style={{ width: "100%" }}
                    type="number"
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", width: "50%" }}>
                  <StringDropdown
                    value={selectedQuantitySold}
                    onChange={setSelectedQuantitySold}
                    options={[
                      { label: "Tăng dần", value: "ASC" },
                      { label: "Giảm dần", value: "DESC" },
                    ]}
                    placeholder="-- Chọn thứ tự sắp xếp số lượng đã bán --"
                    error={undefined}
                  />
                  <StringDropdown
                    value={selectedNumberOfVisits}
                    onChange={setSelectedNumberOfVisits}
                    options={[
                      { label: "Tăng dần", value: "ASC" },
                      { label: "Giảm dần", value: "DESC" },
                    ]}
                    placeholder="-- Chọn thứ tự sắp xếp lượt truy cập --"
                    error={undefined}
                  />
                </div>
              </div>
            </div>
            <div className="header-actions-product">
              <div className="button-create-product">
                <button onClick={handleAdd}>
                  <FaPlus /> Thêm mới
                </button>
              </div>
              <div className="button-search-product">
                <button onClick={handleSearchProducts}>
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
          onSelect={(ids: number[]) => console.log("Chọn:", ids)}
        />
      </Pagination>

      {isModalOpen && (
        <ProductModal
          productId={modalProductId}
          mode={modalMode}
          onClose={handleCloseModal}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          title={
            confirmAction === "delete"
              ? "Xác nhận xóa sản phẩm"
              : "Xác nhận cập nhật trạng thái"
          }
          message={
            confirmAction === "delete"
              ? "Bạn có chắc chắn muốn xóa sản phẩm này?"
              : "Bạn có chắc chắn muốn thay đổi trạng thái sản phẩm?"
          }
          onConfirm={() =>
            confirmAction === "delete"
              ? handleDelete(selectedId!)
              : handleUpdateStatus(selectedId!)
          }
          onCancel={() => setShowConfirm(false)}
          type="delete"
        />
      )}
    </div>
  );
};

export default ProductPage;
