import React, { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import { createOrUpdate, getDiscountById } from "../../../../api/discount";
import { ProductSearch } from "../../../../api/product";
import DateOnePicker from "../../../../components/common/dateRangePicker/DateOnePicker";
import Dropdown from "../../../../components/common/dropdown/Dropdown";
import MultiDropdown from "../../../../components/common/dropdown/MultiDropdown";
import Input from "../../../../components/common/input/Input";
import Loading from "../../../../components/common/loading/Loading";
import { useToast } from "../../../../components/toastProvider/ToastProvider";
import "./DiscountModal.css";
import { sendNotification } from "../../../../api/notification";
import { searchUsers } from "../../../../api/user";

interface BrandModalProps {
  discountId?: number | null | string;
  onClose: (shouldReload?: boolean) => void;
  mode: "add" | "edit" | "view";
}

interface Option {
  label: string;
  value: string;
}

export interface UserTable {
  id: number;
  username: string;
  email: string;
  active: boolean;
  locked: boolean;
  createdDate: string;
  lastName: string;
  firstName: string;
  countLock: number;
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
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [users, setUsers] = useState<UserTable[]>([]);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && discountId) {
      setLoading(true);
      getDiscountById(Number(discountId))
        .then((res) => {
          const d = res.data;

          setName(d.name || "");
          setDiscountPercent(String(d.discountPercent || ""));
          setDate(formatDate(d.expiredDate) || null);
          setSelectedStatus(d.status);
          const productIds: string[] = Array.isArray(d.discountProducts)
            ? d.discountProducts.map((dp: any) => String(dp.productId))
            : [];

          setSelectedValues(productIds);
        })
        .catch(() => showToast("Lỗi lấy dữ liệu giảm giá", "error"))
        .finally(() => setLoading(false));
    }
  }, [discountId, mode]);


  const handleSearch = () => {
    setLoading(true);
    const params = {
      username: "",
      fromDate: "",
      toDate: "",
      isActive: "",
      isLocked: "",
    };
    searchUsers(params)
      .then((response) => {
        setUsers(response.data);
      })
      .catch(() => {
        showToast("Lỗi lấy dữ liệu người dùng", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    handleGetProducts();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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
      .catch(() => {
        showToast("Lỗi lấy dữ liệu sản phẩm", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {

    if (!name.trim()) {
      showToast("Vui lòng nhập tên giảm giá!", "info");
      return;
    }

    if (!discountPercent.trim()) {
      showToast("Vui lòng nhập phần trăm giảm giá!", "info");
      return;
    }

    const discountValue = Number(discountPercent);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      showToast("Phần trăm giảm giá phải là số từ 0 đến 100!", "info");
      return;
    }

    if (!date) {
      showToast("Vui lòng chọn Ngày kết thúc giảm giá!", "info");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      showToast("Ngày kết thúc giảm giá phải lớn hơn hoặc bằng hôm nay!", "info");
      return;
    }

    if (selectedStatus === null) {
      showToast("Vui lòng chọn trạng thái!", "info");
      return;
    }

    if (selectedValues.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 sản phẩm!", "info");
      return;
    }

    const payload = {
      id: discountId ? Number(discountId) : null,
      name,
      discountPercent: Number(discountPercent),
      expiredDate: date,
      status: selectedStatus,
      productIds: selectedValues,
    };

    createOrUpdate(payload).then(() => {
      const productNames = productOptions
        .filter((p) => selectedValues.includes(p.value))
        .map((p) => p.label)
        .join(", ");
      const message = `Có các sản phẩm mới được giảm giá: ${productNames}`;
      if (users.length === 0) {
        showToast("Không có người dùng nào để gửi thông báo giảm giá!", "info");
        onClose(true);
        return;
      } else {
        users.forEach((user) => {
          sendNotification({
            userId: user.id,
            type: "DISCOUNT",
            title: "Thông báo giảm giá sản phẩm",
            message: message,
            failReason: ""
          }).then().catch();
        });
      }
      onClose(true);
      if (mode === "edit") {
        showToast("Cập nhật mã giảm giá thành công!", "success");
      } else {
        showToast("Thêm mã giảm giá thành công!", "success");
      }
    }).catch(() => {
      showToast("Có lỗi xảy ra khi thêm mã giảm giá!", "error");
    });
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

          <div style={{ display: "flex", gap: "10px" }}>
            <div className="modal-field" style={{ width: "100%" }}>
              <div className="modal-label-name">Sản phẩm:</div>
              <MultiDropdown
                value={selectedValues}
                onChange={setSelectedValues}
                options={productOptions}
                disabled={mode === "view"}
              />
            </div>
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

export default DiscountModal;
