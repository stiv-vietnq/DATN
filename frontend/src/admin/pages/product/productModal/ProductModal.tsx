import React, { useEffect, useState } from "react";
import { FaPlus, FaX } from "react-icons/fa6";
import Dropdown from "../../../../components/common/dropdown/Dropdown";
import StringDropdown from "../../../../components/common/dropdown/StringDropdown";
import Input from "../../../../components/common/input/Input";
import Loading from "../../../../components/common/loading/Loading";
import MultiImageUpload from "../../../../components/common/multiImageUpload/MultiImageUpload";
import Textarea from "../../../../components/common/textarea/Textarea";
import ProductDetailItem, { ProductDetail } from "./productDetailItem/ProductDetailItem";
import "./ProductModal.css";

interface ProductModalProps {
    productId?: number | null | string;
    onClose: () => void;
    mode: "add" | "edit" | "view";
}

const ProductModal: React.FC<ProductModalProps> = ({
    productId,
    onClose,
    mode,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<boolean | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [price, setPrice] = useState<string>("");
    const [percentageReduction, setPercentageReduction] = useState<string>("");
    const [imageIdsToRemove, setImageIdsToRemove] = useState<number[]>([]);
    const [listProductDetailIdRemove, setListProductDetailIdRemove] = useState<number[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

    useEffect(() => {
        if ((mode === "edit" || mode === "view") && productId) {
            setName("Áo sơ mi nam");
            setDescription("Áo sơ mi cotton cao cấp");
            setSelected(true);
            setSelectedBrand("Thời Trang Nam");
            setSelectedCategory("Áo Nam");
            setPrice("250000");
            setPercentageReduction("10");
            setProductDetails([
                {
                    id: 1,
                    name: "Size M",
                    quantity: 100,
                    price: "250000",
                    percentageReduction: "10",
                    description: "Áo vừa người cao 1m7",
                    type: 1,
                    imageFile: null,
                },
            ]);
        }
    }, [productId, mode]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Vui lòng nhập tên sản phẩm!");
            return;
        }

        if (mode === "add" && files.length === 0) {
            alert("Vui lòng chọn ít nhất một ảnh sản phẩm!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        files.forEach((file) => formData.append("files", file));
        formData.append("deletedImageIds", JSON.stringify(imageIdsToRemove));
        if (mode === "edit" && productId) {
            formData.append("id", productId.toString());
        }
        productDetails.forEach((detail, index) => {
            formData.append(`productDetailDTOS[${index}].name`, detail.name);
            formData.append(`productDetailDTOS[${index}].quantity`, detail.quantity.toString());
            formData.append(`productDetailDTOS[${index}].price`, detail.price.toString());
            formData.append(`productDetailDTOS[${index}].percentageReduction`, detail.percentageReduction.toString());
            formData.append(`productDetailDTOS[${index}].description`, detail.description);
            formData.append(`productDetailDTOS[${index}].type`, detail.type.toString());
            if (detail.imageFile) {
                formData.append(`productDetailDTOS[${index}].imageFile`, detail.imageFile);
            }
        });
        formData.append("listProductDetailIdRemove", JSON.stringify(listProductDetailIdRemove));

        console.log("📦 Gửi dữ liệu formData:", Object.fromEntries(formData));
        alert(mode === "add" ? "Thêm mới thành công!" : "Cập nhật thành công!");
        onClose();
    };

    const handleAddProductDetail = () => {
        setProductDetails((prev) => [
            ...prev,
            {
                name: "",
                quantity: 0,
                price: "",
                percentageReduction: "",
                description: "",
                type: "",
                imageFile: null,
            },
        ]);
    };

    const handleRemoveProductDetail = (index: number) => {
        const removed = productDetails[index];
        if (removed.id !== undefined) {
            setListProductDetailIdRemove((prev) => [...prev, removed.id as number]);
        }
        setProductDetails((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDetailChange = (
        index: number,
        field: keyof ProductDetail,
        value: any
    ) => {
        setProductDetails((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    };

    if (loading) return <Loading />;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <div className="modal-title">
                        {mode === "add" && "Thêm sản phẩm"}
                        {mode === "edit" && "Chỉnh sửa sản phẩm"}
                        {mode === "view" && "Xem sản phẩm"}
                    </div>
                    <div className="button-close">
                        <button onClick={onClose}>
                            <FaX />
                        </button>
                    </div>
                </div>

                <div className="modal-body">
                    {/* --- Thông tin chung --- */}
                    <div className="modals-field">
                        <div className="modal-field">
                            <div className="modal-label-name">Tên sản phẩm:</div>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập tên sản phẩm..."
                                style={{ width: "100%" }}
                                disabled={mode === "view"}
                            />
                        </div>
                        <div className="modal-field">
                            <div className="modal-label-name">Thương hiệu sản phẩm:</div>
                            <StringDropdown
                                value={selectedBrand}
                                onChange={setSelectedBrand}
                                options={[
                                    { label: "Thời Trang Nam", value: "Thời Trang Nam" },
                                    { label: "Thời Trang Nữ", value: "Thời Trang Nữ" },
                                    { label: "Trang Phục Unisex", value: "Trang Phục Unisex" },
                                ]}
                                placeholder="-- Chọn thương hiệu --"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>

                    <div className="modals-field">
                        <div className="modal-field" style={{ marginBottom: "-20px" }}>
                            <div className="modal-label-name">Danh mục sản phẩm:</div>
                            <StringDropdown
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                options={[
                                    { label: "Áo Nam", value: "Áo Nam" },
                                    { label: "Áo Nữ", value: "Áo Nữ" },
                                ]}
                                placeholder="-- Chọn danh mục --"
                                disabled={mode === "view"}
                            />
                        </div>

                        <div className="modal-field">
                            <div className="modal-label-name">Trạng thái:</div>
                            <Dropdown
                                value={selected}
                                onChange={setSelected}
                                options={[
                                    { label: "Đang hoạt động", value: true },
                                    { label: "Không hoạt động", value: false },
                                ]}
                                placeholder="--Chọn trạng thái--"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>

                    {/* --- Giá & Giảm giá --- */}
                    <div className="modals-field">
                        <div className="modal-field">
                            <div className="modal-label-name">Đơn giá:</div>
                            <Input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Nhập đơn giá sản phẩm..."
                                style={{ width: "100%" }}
                                disabled={mode === "view"}
                            />
                        </div>
                        <div className="modal-field">
                            <div className="modal-label-name">Giảm giá sản phẩm:</div>
                            <Input
                                value={percentageReduction}
                                onChange={(e) => setPercentageReduction(e.target.value)}
                                placeholder="Nhập phần trăm giảm giá..."
                                style={{ width: "100%" }}
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>

                    {/* --- Sản phẩm chi tiết --- */}
                    <div className="modal-field">
                        <div className="modal-field-product-detail">
                            <div className="modal-label-product-detail">Sản phẩm chi tiết</div>
                            {mode !== "view" && (
                                <div
                                    className="modal-label-product-detail-icon"
                                    onClick={handleAddProductDetail}
                                    style={{ cursor: "pointer" }}
                                >
                                    <FaPlus />
                                </div>
                            )}
                        </div>

                        {productDetails.map((detail, index) => (
                            <ProductDetailItem
                                key={index}
                                index={index}
                                detail={detail}
                                onChange={handleDetailChange}
                                onRemove={handleRemoveProductDetail}
                                disabled={mode === "view"}
                            />
                        ))}
                    </div>

                    {/* --- Mô tả --- */}
                    <div className="modals-field" style={{ marginBottom: "8px" }}>
                        <div className="modal-field">
                            <div className="modal-label-name">Mô tả sản phẩm:</div>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Nhập mô tả sản phẩm..."
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>

                    {/* --- Ảnh sản phẩm --- */}
                    <div className="modals-field" style={{ marginBottom: "8px" }}>
                        <div className="modal-field">
                            <div className="modal-label-name">Ảnh sản phẩm:</div>
                            <MultiImageUpload
                                initialImages={[]}
                                onChange={(newFiles) => setFiles(newFiles)}
                                onDelete={(deleted) => setImageIdsToRemove(deleted)}
                                disabled={mode === "view"} // ✅ disable upload
                            />
                        </div>
                    </div>
                </div>

                {/* --- Nút hành động --- */}
                <div className="modal-actions">
                    {mode !== "view" && (
                        <button className="btn-green" onClick={handleSubmit}>
                            {mode === "add" ? "Thêm mới" : "Lưu"}
                        </button>
                    )}
                    <button onClick={onClose} className="btn-secondary">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
