import React, { useEffect, useState } from "react";
import "./BrandModal.css";
import { FaX } from "react-icons/fa6";
import Input from "../../../../components/common/input/Input";
import Textarea from "../../../../components/common/textarea/Textarea";
import ImageUpload from "../../../../components/common/imageUpload/ImageUpload";
import { createOrUpdateBrand, getBrandById } from "../../../../api/brand";
import Loading from "../../../../components/common/loading/Loading";

interface BrandModalProps {
  brandId?: number | null | string;
  onClose: () => void;
  mode: "add" | "edit" | "view";
}

const BrandModal: React.FC<BrandModalProps> = ({ brandId, onClose, mode }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && brandId) {
      getBrandById(brandId)
        .then((response) => {
          const data = response?.data;
          setName(data?.name);
          setDescription(data?.description || "");
          console.log(data);
          if (data?.directoryPath) setPreview(data?.directoryPath);
        })
        .catch((error) => {
          console.error(error);
          alert("Lỗi khi tải dữ liệu thương hiệu!");
        });
    }
  }, [brandId, mode]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleSubmit = async () => {
    if (!name) {
      alert("Vui lòng nhập tên thương hiệu!");
      return;
    }

    if (!file && mode === "add") {
      alert("Vui lòng chọn ảnh thương hiệu!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    } else if (preview) {
      formData.append("directoryPath", preview);
    }
    if (mode === "edit" && brandId) formData.append("id", brandId.toString());

    try {
      setLoading(true);
      await createOrUpdateBrand(formData);
      alert(
        mode === "add"
          ? "Thêm thương hiệu thành công!"
          : "Cập nhật thương hiệu thành công!"
      );
      onClose();
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert("Tên thương hiệu đã tồn tại!");
      } else {
        alert("Lỗi khi gửi dữ liệu!");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading />;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            {mode === "add" && "Thêm thương hiệu"}
            {mode === "edit" && "Chỉnh sửa thương hiệu"}
            {mode === "view" && "Xem thương hiệu"}
          </div>
          <div className="button-close">
            <button onClick={onClose}>
              <FaX />
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <div className="modal-label-name">Tên thương hiệu:</div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tìm kiếm theo tên thương hiệu....."
              style={{ width: "100%" }}
              disabled={mode === "view"}
            />
          </div>

          <div className="modal-field" style={{ marginBottom: "28px" }}>
            <div className="modal-label-name">Mô tả thương hiệu:</div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả thương hiệu..."
              disabled={mode === "view"}
            />
          </div>

          <div className="modal-field">
            <div className="modal-label-name">Ảnh thương hiệu:</div>
            <ImageUpload
              onChange={setFile}
              initialPreview={preview}
              disabled={mode === "view"}
            />
          </div>
        </div>
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

export default BrandModal;
