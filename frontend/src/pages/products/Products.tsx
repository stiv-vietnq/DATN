import { Input } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowDownWideShort, FaArrowUpShortWide, FaBars, FaChevronRight, FaFilter, FaPuzzlePiece } from "react-icons/fa6";
import Loading from "../../components/common/loading/Loading";
import "./Products.css";
import RatingFilter from "./ratingFilter/RatingFilter";

const phoneCompanies = ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo", "Realme", "Huawei"];
const productTypes = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "Xiaomi" }
];
type SortFieldKey = "createdDate" | "price" | "quantity" | "views";

export default function Products() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [activeIndexBrand, setActiveIndexBrand] = useState<number | null>(null);
  const [activeIndexType, setActiveIndexType] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [sortOrders, setSortOrders] = useState<Record<SortFieldKey, "asc" | "desc">>({
    createdDate: "asc",
    price: "asc",
    quantity: "asc",
    views: "asc",
  });
  const [showAll, setShowAll] = useState(false);

  const sortFields: { key: SortFieldKey; label: string }[] = [
    { key: "createdDate", label: "Ngày tạo" },
    { key: "price", label: "Giá" },
    { key: "quantity", label: "Số lượng" },
    { key: "views", label: "Số lượng truy cập" },
  ];

  const toggleSort = (fieldKey: SortFieldKey) => {
    setSortOrders((prev) => ({
      ...prev,
      [fieldKey]: prev[fieldKey] === "asc" ? "desc" : "asc",
    }));
  };
  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleItemClick = (index: number) => {
    setActiveIndexType(index);
  };

  const visibleCompanies = showAllBrands
    ? phoneCompanies
    : phoneCompanies?.slice(0, 5);

  const visibleFields = showAll ? sortFields : sortFields.slice(0, 1);

  if (loading) return <Loading />;

  return (
    <div className="main-content">
      <div className="products-content">
        <div className="products-search-results">
          <div className="phone-company-search">
            {/* --- Tên nhóm hãng điện thoại --- */}
            <div className="phone-company-search-title">
              <FaBars className="icon-bars" />
              {t("all_phone_brands")}
            </div>

            {/* --- Danh sách hãng điện thoại --- */}
            <div className="phone-company-search-list">
              {visibleCompanies.map((company, index) => (
                <div
                  key={company}
                  className={`phone-company-search-item ${activeIndexBrand === index ? "active" : ""
                    }`}
                  onClick={() => setActiveIndexBrand(index)}
                >
                  <div className="phone-company-search-item-logo">
                    {activeIndexBrand === index && <FaChevronRight size={12} />}
                  </div>
                  <div className="phone-company-search-item-name">{company}</div>
                </div>
              ))}

              {/* --- Nút Xem thêm / Thu gọn --- */}
              {phoneCompanies.length > 5 && (
                <div
                  className="phone-company-toggle"
                  onClick={() => setShowAllBrands((prev) => !prev)}
                >
                  {showAllBrands ? t("hide") : t("show_more")}
                </div>
              )}
            </div>

            {/* --- Loại sản phẩm --- */}
            <div
              className="phone-company-search-title"
              style={{ marginTop: "20px" }}
            >
              <FaPuzzlePiece className="icon-bars" />
              {t("product_types")}
            </div>

            <div className="phone-company-search-list">
              {productTypes.map((productType, index) => (
                <div
                  key={productType?.id}
                  className={`phone-company-search-item ${activeIndexType === index ? "active" : ""
                    }`}
                  onClick={() => handleItemClick(index)}
                >
                  <div className="phone-company-search-item-logo">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(productType?.id)}
                      onChange={() => handleCheckboxChange(productType?.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {activeIndexType === index && <FaChevronRight size={12} />}
                  </div>
                  <div className="phone-company-search-item-name">
                    {productType?.name}
                  </div>
                </div>
              ))}
            </div>

            {/* --- Bộ lọc giá --- */}
            <div
              className="phone-company-search-title"
              style={{ marginTop: "20px" }}
            >
              <FaFilter className="icon-bars" />
              {t("search_filters")}
            </div>

            <div className="phone-company-search-list-price">
              <div>{t("price_range")}</div>

              <div className="phone-company-search-list-price-input">
                <Input placeholder={t("from")} className="input-price" type="number" />
                <span style={{ margin: "0 5px" }}>-</span>
                <Input placeholder={t("to")} className="input-price" type="number" />
              </div>

              <div className="phone-company-search-list-price-button">
                <button className="btn-apply-filters">{t("apply_filters")}</button>
              </div>
            </div>

            {/* --- Đánh giá --- */}
            <div className="phone-company-search-list-evaluate">
              <div>{t("evaluate")}</div>

              <div className="phone-company-search-list-evaluate-input">
                <RatingFilter onSelect={(rating) => console.log("Đã chọn:", rating)} />
              </div>
            </div>

            {/* --- thứ tự sắp xếp --- */}
            <div className="phone-company-search-list-sort">
              <div>{t("sort_by")}</div>

              <div className="phone-company-search-list-sort-options">
                {visibleFields.map(({ key, label }) => (
                  <div
                    key={key}
                    className="phone-company-search-list-sort-options-item"
                    style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
                  >
                    <div className="phone-company-search-list-sort-options-title" style={{ width: "150px" }}>
                      {label}
                    </div>
                    <div className="phone-company-search-list-sort-options-filter">
                      <div
                        className="sort-icon-option"
                        style={{ display: "flex", gap: "10px", alignItems: "center", cursor: "pointer" }}
                        onClick={() => toggleSort(key)}
                      >
                        {sortOrders[key] === "asc" ? (
                          <FaArrowDownWideShort style={{ marginRight: "5px", color: "#ff6b6b" }} />
                        ) : (
                          <FaArrowUpShortWide style={{ marginRight: "5px", color: "#007bff" }} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: "10px", cursor: "pointer", color: "#007bff", fontSize: '13px' }} onClick={() => setShowAll(!showAll)}>
                  {showAll ? t("hide") : t("show_more")}
                </div>
              </div>
            </div>
          </div>

          <div className="products-search-button">
            <div className="phone-company-search-list-price-button">
              <button className="btn-apply-filters">{t("reset_all")}</button>
            </div>
          </div>
        </div>

        {/* --- Phần danh sách sản phẩm --- */}
        <div className="products-data-list">vietnq</div>
      </div >
    </div >
  );
}
