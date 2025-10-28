import React, { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import {
  createOrUpdateCategory,
  getCategoryById,
} from "../../../../api/category";
import ImageUpload from "../../../../components/common/imageUpload/ImageUpload";
import Input from "../../../../components/common/input/Input";
import Loading from "../../../../components/common/loading/Loading";
import Textarea from "../../../../components/common/textarea/Textarea";
import "./CategoryModal.css";
import Dropdown from "../../../../components/common/dropdown/Dropdown";

interface CategoryModalProps {
  categoryId?: number | null | string;
  onClose: () => void;
  mode: "add" | "edit" | "view";
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  categoryId: categoryId,
  onClose,
  mode,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<boolean | null>(null);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && categoryId) {
      getCategoryById(categoryId)
        .then((response) => {
          const data = response?.data;
          setName(data?.name);
          setDescription(data?.description || "");
          if (data?.directoryPath) setPreview(data?.directoryPath);
        })
        .catch((error) => {
          console.error(error);
          alert("Lỗi khi tải dữ liệu thương hiệu!");
        });
    }
  }, [categoryId, mode]);

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
    if (file) formData.append("file", file);
    if (mode === "edit" && categoryId)
      formData.append("id", categoryId.toString());

    try {
      setLoading(true);
      await createOrUpdateCategory(formData);
      alert(
        mode === "add"
          ? "Thêm danh mục thành công!"
          : "Cập nhật danh mục thành công!"
      );
      onClose();
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert("Tên danh mục đã tồn tại!");
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
            {mode === "add" && "Thêm danh mục"}
            {mode === "edit" && "Chỉnh sửa danh mục"}
            {mode === "view" && "Xem danh mục"}
          </div>
          <div className="button-close">
            <button onClick={onClose}>
              <FaX />
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <div className="modal-label-name">Tên danh mục:</div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tìm kiếm theo tên danh mục....."
              style={{ width: "100%" }}
            />
          </div>

          <div className="modal-field">
            <div className="modal-label-name">Thương hiệu:</div>
            <Dropdown
              value={selectedBrand}
              onChange={setSelectedBrand}
              options={[
                { label: "Đang hoạt động", value: true },
                { label: "Không hoạt động", value: false },
              ]}
              placeholder="--Chọn tất cả--"
              error={undefined}
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
              placeholder="--Chọn tất cả--"
              error={undefined}
            />
          </div>

          <div className="modal-field" style={{ marginBottom: "28px" }}>
            <div className="modal-label-name">Mô tả thương hiệu:</div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả danh mục..."
              disabled={mode === "view"}
            />
          </div>

          <div className="modal-field">
            <div className="modal-label-name">Ảnh danh mục:</div>
            <ImageUpload onChange={setFile} initialPreview={preview} />
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

export default CategoryModal;
