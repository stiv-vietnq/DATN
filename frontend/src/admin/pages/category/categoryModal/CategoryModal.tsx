import React, { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import { getProductTypeByStatus } from "../../../../api/brand";
import {
  createOrUpdateCategory,
  getCategoryById,
} from "../../../../api/category";
import StringDropdown from "../../../../components/common/dropdown/StringDropdown";
import ImageUpload from "../../../../components/common/imageUpload/ImageUpload";
import Input from "../../../../components/common/input/Input";
import Loading from "../../../../components/common/loading/Loading";
import Textarea from "../../../../components/common/textarea/Textarea";
import "./CategoryModal.css";

interface CategoryModalProps {
  categoryId?: number | null | string;
  onClose: (shouldReload?: boolean) => void;
  mode: "add" | "edit" | "view";
}

interface Option {
  label: string;
  value: string;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  categoryId: categoryId,
  onClose,
  mode,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [brandOptions, setBrandOptions] = useState<Option[]>([]);

  useEffect(() => {
    getAllBrands();
    if ((mode === "edit" || mode === "view") && categoryId) {
      getCategoryById(categoryId)
        .then((response) => {
          const data = response?.data;
          setName(data?.name);
          setDescription(data?.description || "");
          if (data?.directoryPath) setPreview(data?.directoryPath);
          if (data?.productType?.id) {
            setSelectedBrandId(String(data.productType.id));
          }
          setSelected(data?.status ? "true" : "false");
        })
        .catch((error) => {
          console.error(error);
          alert("Lỗi khi tải dữ liệu thương hiệu!");
        });
    }
  }, [categoryId, mode]);

  const getAllBrands = () => {
    getProductTypeByStatus({ status: "true" })
      .then((response) => {
        const data = response?.data || [];
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

    if (!selectedBrandId) {
      alert("Vui lòng chọn thương hiệu cho danh mục!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("code", code);
    formData.append("description", description);
    formData.append("status", selected === null ? "" : String(selected));
    if (file) {
      formData.append("file", file);
    } else if (preview) {
      formData.append("directoryPath", preview);
    }
    if (mode === "edit" && categoryId)
      formData.append("id", categoryId.toString());
    formData.append("productTypeId", selectedBrandId?.toString() || "");

    try {
      setLoading(true);
      await createOrUpdateCategory(formData);
      onClose(true);
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

  const generateBrandCode = (name: string) => {
    if (!name) return "";
    const normalized = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();
    return normalized.substring(0, 50);
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
            <button onClick={() => onClose(false)}>
              <FaX />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div style={{ display: "flex", gap: "10px" }}>
            <div className="modal-field">
              <div className="modal-label-name">Mã danh mục:</div>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Mã danh mục"
                style={{ width: "100%" }}
                disabled
              />
            </div>
            <div className="modal-field">
              <div className="modal-label-name">Tên danh mục:</div>
              <Input
                value={name}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  if (mode === "add") {
                    setCode(generateBrandCode(value));
                  }
                }}
                placeholder="Nhập tên danh mục....."
                style={{ width: "100%" }}
                disabled={mode === "view"}
              />
            </div>
          </div>

          <div className="modal-field">
            <div className="modal-label-name">Thương hiệu:</div>
            <StringDropdown
              value={selectedBrandId}
              onChange={setSelectedBrandId}
              options={brandOptions}
              placeholder="--Chọn thương hiệu--"
              error={undefined}
              disabled={mode === "view"}
            />
          </div>

          <div className="modal-field">
            <div className="modal-label-name">Trạng thái:</div>
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
              disabled={mode === "view"}
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

export default CategoryModal;
