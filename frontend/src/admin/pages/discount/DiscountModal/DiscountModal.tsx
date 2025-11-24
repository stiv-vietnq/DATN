import React, { use, useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import Input from "../../../../components/common/input/Input";
import Loading from "../../../../components/common/loading/Loading";
import "./DiscountModal.css";
import DateOnePicker from "../../../../components/common/dateRangePicker/DateOnePicker";
import MultiDropdown from "../../../../components/common/dropdown/MultiDropdown";
import { ProductSearch } from "../../../../api/product";
import Dropdown from "../../../../components/common/dropdown/Dropdown";

interface BrandModalProps {
  discountId?: number | null | string;
  onClose: (shouldReload?: boolean) => void;
  mode: "add" | "edit" | "view";
}

interface Option {
  label: string;
  value: string;
}

const DiscountModal: React.FC<BrandModalProps> = ({
  discountId,
  onClose,
  mode,
}) => {
  const [name, setName] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [productOptions, setProductOptions] = useState<Option[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && discountId) {
    }
  }, [discountId, mode]);

  useEffect(() => {
    handleGetProducts();
  }, []);

  let error = "";
  if (date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    if (selected < today) {
      error = "Ngày không được nhỏ hơn hôm nay";
    }
  }

  const handleGetProducts = () => {
    setLoading(true);
    ProductSearch({
      productTypeId: null,
      categoryId: null,
      name: null,
      minPrice: null,
      maxPrice: null,
      status: null,
      orderBy: null,
      priceOrder: null,
      page: null,
      size: null,
      quantitySold: null,
      numberOfVisits: null,
      evaluate: null,
    })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: Option[] = data.map((item: any) => ({
          label: item.productName,
          value: item.id,
        }));
        setProductOptions(mappedOptions);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <Loading />;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            {mode === "add" && "Thêm giảm giá"}
            {mode === "edit" && "Chỉnh sửa giảm giá"}
            {mode === "view" && "Xem giảm giá"}
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
              <div className="modal-label-name">Tên giảm giá:</div>
              <Input
                value={name}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                }}
                placeholder="Nhập tên giảm giá....."
                style={{ width: "100%" }}
                disabled={mode === "view"}
              />
            </div>
            <div className="modal-field">
              <div className="modal-label-name">Phần trăm giảm giá:</div>
              <Input
                type="number"
                value={discountPercent}
                onChange={(e) => {
                  const value = e.target.value;
                  setDiscountPercent(value);
                }}
                placeholder="Nhập phần trăm giảm giá....."
                style={{ width: "100%" }}
                disabled={mode === "view"}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div className="modal-field">
              <div className="modal-label-name">Ngày kết thúc giảm giá:</div>
              <DateOnePicker
                date={date}
                onChange={setDate}
                style={{ width: "100%" }}
                disabled={mode === "view"}
                error={error}
              />
            </div>
            <div className="modal-field">
              <div className="modal-label-name">Trạng thái:</div>
              <Dropdown
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { label: "Đang hoạt động", value: true },
                  { label: "Không hoạt động", value: false },
                ]}
                placeholder="--Chọn trạng thái--"
                disabled={mode === "view"}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
            <div className="modal-field" style={{ width: "100%" }}>
              <div className="modal-label-name">Sản phẩm:</div>
              <MultiDropdown
                value={selectedValues}
                onChange={setSelectedValues}
                options={productOptions}
              />
            </div>
          </div>
        </div>
        <div className="modal-actions">
          {mode !== "view" && (
            <button className="btn-green">
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

export default DiscountModal;
