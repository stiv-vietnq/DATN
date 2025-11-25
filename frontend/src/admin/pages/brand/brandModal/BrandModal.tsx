import React, { useEffect, useState } from "react";
import "./BrandModal.css";
import { FaX } from "react-icons/fa6";
import Input from "../../../../components/common/input/Input";
import Textarea from "../../../../components/common/textarea/Textarea";
import ImageUpload from "../../../../components/common/imageUpload/ImageUpload";
import { createOrUpdateBrand, getBrandById } from "../../../../api/brand";
import Loading from "../../../../components/common/loading/Loading";
import { useToast } from "../../../../components/toastProvider/ToastProvider";

interface BrandModalProps {
  brandId?: number | null | string;
  onClose: (shouldReload?: boolean) => void;
  mode: "add" | "edit" | "view";
}

const BrandModal: React.FC<BrandModalProps> = ({ brandId, onClose, mode }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && brandId) {
      getBrandById(brandId)
        .then((response) => {
          const data = response?.data;
          setName(data?.name);
          setDescription(data?.description || "");
          setCode(data?.code || "");
          if (data?.directoryPath) setPreview(data?.directoryPath);
        })
        .catch(() => {
          showToast("Lỗi lấy dữ liệu thương hiệu", "error");
        });
    }
  }, [brandId, mode]);

  const generateBrandCode = (name: string) => {
    if (!name) return "";
    const normalized = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();
    return normalized.substring(0, 10);
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleSubmit = async () => {

    if (!name) {
      showToast("Vui lòng nhập tên thương hiệu!", "error");
      return;
    }

    if (!file && mode === "add") {
      showToast("Vui lòng chọn ảnh thương hiệu!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("code", code);
    formData.append("name", name);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    } else if (preview) {
      formData.append("directoryPath", preview);
    }
    if (mode === "edit" && brandId) formData.append("id", brandId.toString());

    createOrUpdateBrand(formData)
      .then(() => {
        onClose(true);
        if (mode === "edit") {
          showToast("Cập nhật thương hiệu thành công!", "success");
        } else {
          showToast("Thêm mới thương hiệu thành công!", "success");
        }
      })
      .catch((error: any) => {
        if (error.response?.status === 409) {
          if (error.response?.data?.includes("code")) {
            showToast("Mã thương hiệu đã tồn tại!", "error");
          } else if (error.response?.data?.includes("name")) {
            showToast("Tên thương hiệu đã tồn tại!", "error");
          }
        } else {
          showToast("Lỗi khi gửi dữ liệu!", "error");
        }
      })
      .finally(() => {
        setLoading(false);
      });
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
            <button onClick={() => onClose(false)}>
              <FaX />
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div style={{ display: "flex", gap: "10px" }}>
            <div className="modal-field">
              <div className="modal-label-name">Mã thương hiệu:</div>
              <Input
                value={code}
                onChange={() => { }}
                placeholder="Mã thương hiệu"
                style={{ width: "100%", cursor: "not-allowed" }}
                disabled
              />
            </div>
            <div className="modal-field">
              <div className="modal-label-name">Tên thương hiệu:</div>
              <Input
                value={name}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  if (mode === "add") {
                    setCode(generateBrandCode(value));
                  }
                }}
                placeholder="Nhập tên thương hiệu....."
                style={{ width: "100%" }}
                disabled={mode === "view"}
              />
            </div>
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
          <button onClick={() => onClose(false)} className="btn-secondary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;
