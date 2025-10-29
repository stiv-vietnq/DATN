import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, { BaseColumn } from "../../../components/table/BaseTableLayout";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import Input from "../../../components/common/input/Input";
import Dropdown from "../../../components/common/dropdown/Dropdown";
// import ProductModal from "./productModal/ProductModal";
import "./ProductPage.css";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";
import ProductModal from "./productModal/ProductModal";

// Dữ liệu product
interface Product {
    id: number;
    productName: string;
    categoryName: string;
    brandName: string;
    price: number;
    description: string;
    status: boolean;
    createdDate: string;
    updatedDate: string;
    quantitySold: number;
    percentageReduction: number;
    numberOfVisits: number;
}

const ProductPage = () => {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [name, setName] = useState("");
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
    const [modalProductId, setModalProductId] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"delete" | "status" | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selected, setSelected] = useState<boolean | null>(null);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedQuantitySold, setSelectedQuantitySold] = useState<string | null>(null);
    const [selectedNumberOfVisits, setSelectedNumberOfVisits] = useState<string | null>(null);

    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            productName: "Áo Thun Nam",
            categoryName: "Thời Trang Nam",
            brandName: "Brand A",
            price: 250000,
            description: "Áo thun cotton cao cấp",
            status: true,
            createdDate: "2025-10-01",
            updatedDate: "2025-10-05",
            quantitySold: 120,
            percentageReduction: 10,
            numberOfVisits: 500,
        },
        {
            id: 2,
            productName: "Áo Sơ Mi Nữ",
            categoryName: "Thời Trang Nữ",
            brandName: "Brand B",
            price: 320000,
            description: "Áo sơ mi công sở thanh lịch",
            status: true,
            createdDate: "2025-09-20",
            updatedDate: "2025-09-25",
            quantitySold: 85,
            percentageReduction: 5,
            numberOfVisits: 320,
        },
        {
            id: 3,
            productName: "Quần Jean",
            categoryName: "Trang Phục Unisex",
            brandName: "Brand C",
            price: 450000,
            description: "Quần jean co giãn bền đẹp",
            status: false,
            createdDate: "2025-08-15",
            updatedDate: "2025-08-20",
            quantitySold: 45,
            percentageReduction: 15,
            numberOfVisits: 210,
        },
    ]);

    const [totalItems, setTotalItems] = useState(products.length);

    // Phân trang
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = products.slice(start, end);

    // Columns table
    const columns: BaseColumn<Product>[] = [
        { key: "id", label: "ID", width: "5%" },
        { key: "productName", label: "Tên sản phẩm", width: "15%" },
        { key: "categoryName", label: "Danh mục", width: "10%" },
        { key: "brandName", label: "Thương hiệu", width: "10%" },
        { key: "price", label: "Giá (VNĐ)", width: "10%" },
        { key: "percentageReduction", label: "Giảm giá (%)", width: "10%" },
        { key: "numberOfVisits", label: "Lượt xem", width: "10%" },
        { key: "quantitySold", label: "Đã bán", width: "10%" },
        { key: "createdDate", label: "Ngày tạo", width: "10%" },
        { key: "updatedDate", label: "Ngày cập nhật", width: "10%" },
        {
            key: "status",
            label: "Trạng thái",
            width: "10%",
            render: (item) => (item.status ? "Hoạt động" : "Ngừng bán"),
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
        setProducts(products.filter((p) => p.id !== id));
        setTotalItems(products.length - 1);
        setShowConfirm(false);
    };

    const handleUpdateStatus = (id: number) => {
        setProducts(
            products.map((p) =>
                p.id === id ? { ...p, status: !p.status } : p
            )
        );
        setShowConfirm(false);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSearch = () => {
        // Giả sử fetchProducts là hàm lấy dữ liệu từ API với các tham số lọc
    };

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
                            <div style={{ display: "flex", gap: "10px", marginBottom: "-20px" }}>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tìm kiếm sản phẩm..."
                                    style={{ width: "100%" }}
                                />
                                <StringDropdown
                                    value={selectedBrand}
                                    onChange={setSelectedBrand}
                                    options={[
                                        { label: "Brand A", value: "Brand A" },
                                        { label: "Brand B", value: "Brand B" },
                                        { label: "Brand C", value: "Brand C" },
                                    ]}
                                    placeholder="-- Chọn thương hiệu --"
                                />
                                <StringDropdown
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    options={[
                                        { label: "Thời Trang Nam", value: "Thời Trang Nam" },
                                        { label: "Thời Trang Nữ", value: "Thời Trang Nữ" },
                                        { label: "Trang Phục Unisex", value: "Trang Phục Unisex" },
                                    ]}
                                    placeholder="-- Chọn danh mục --"
                                />

                                <Dropdown
                                    value={selected}
                                    onChange={setSelected}
                                    options={[
                                        { label: "Đang hoạt động", value: true },
                                        { label: "Không hoạt động", value: false },
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
                                    />
                                    <Input
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Giá tối đa..."
                                        style={{ width: "100%" }}
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
                />
            )}
        </div>
    );
};

export default ProductPage;
