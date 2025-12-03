import { Input } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import Textarea from "../../../../../components/common/textarea/Textarea";
import ImageUpload from "../../../../../components/common/imageUpload/ImageUpload";
import "./ProductDetailItem.css";

interface ProductDetailItemProps {
  index: number;
  detail: ProductDetail;
  onChange: (index: number, field: keyof ProductDetail, value: any) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export interface ProductDetail {
  id?: number;
  name: string;
  quantity: number;
  price: string;
  description: string;
  type: number | null;
  directoryPath: File | string | null;
  imageFile?: File | null;
}

const ProductDetailItem: React.FC<ProductDetailItemProps> = ({
  index,
  detail,
  onChange,
  onRemove,
  disabled = false,
}) => {
  const [preview, setPreview] = useState<string | null>(
    typeof detail.directoryPath === "string" ? detail.directoryPath : null
  );

  useEffect(() => {
    if (detail.directoryPath && detail.directoryPath instanceof File) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(detail.directoryPath);
    } else if (typeof detail.directoryPath === "string") {
      setPreview(detail.directoryPath);
    } else {
      setPreview(null);
    }
  }, [detail.directoryPath]);

  return (
    <div className="modal-field-product-detail-list">
      <div className="detail-header">
        <strong>Chi tiết sản phẩm {index + 1}</strong>
        {!disabled && (
          <FaTrash
            onClick={() => onRemove(index)}
            style={{ color: "red", cursor: "pointer" }}
          />
        )}
      </div>

      {/* Tên và Số lượng */}
      <div className="modals-field" style={{ marginBottom: "8px" }}>
        <div className="modal-field">
          <div className="modal-label-name">Tên sản phẩm:</div>
          <Input
            type="text"
            value={detail.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            placeholder="Tên sản phẩm chi tiết..."
            style={{ width: "100%" }}
            disabled={disabled}
          />
        </div>
        <div className="modal-field">
          <div className="modal-label-name">Số lượng:</div>
          <Input
            type="number"
            value={detail.quantity}
            onChange={(e) =>
              onChange(index, "quantity", Number(e.target.value))
            }
            placeholder="Số lượng..."
            style={{ width: "100%" }}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Giá và Giảm giá */}
      <div className="modals-field" style={{ marginBottom: "8px" }}>
        <div className="modal-field">
          <div className="modal-label-name">Đơn giá:</div>
          <Input
            type="text"
            value={detail.price}
            onChange={(e) => onChange(index, "price", e.target.value)}
            placeholder="Đơn giá..."
            style={{ width: "100%" }}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Mô tả */}
      <div className="modals-field" style={{ marginBottom: "8px" }}>
        <div className="modal-field">
          <div className="modal-label-name">Mô tả sản phẩm:</div>
          <Textarea
            value={detail.description}
            onChange={(e) => onChange(index, "description", e.target.value)}
            placeholder="Nhập mô tả sản phẩm..."
            disabled={disabled}
          />
        </div>
      </div>

      {/* Upload ảnh */}
      <div className="modals-field" style={{ marginBottom: "8px" }}>
        <div className="modal-field">
          <div className="modal-label-name">Ảnh sản phẩm chi tiết:</div>
          <ImageUpload
            onChange={(file) => {
              onChange(index, "directoryPath", file);
              onChange(index, "imageFile", file); 
            }}
            initialPreview={preview || undefined}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailItem;
