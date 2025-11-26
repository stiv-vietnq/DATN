import { Input } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowDownWideShort,
  FaArrowUpShortWide,
  FaBars,
  FaChevronRight,
  FaFilter,
  FaPuzzlePiece,
} from "react-icons/fa6";
import Loading from "../../components/common/loading/Loading";
import "./Products.css";
import RatingFilter from "./ratingFilter/RatingFilter";
import { getProductTypeByStatus } from "../../api/brand";
import { getCategorysByProductTypeId } from "../../api/category";
import { ProductSearch } from "../../api/product";
import { useNavigate } from "react-router-dom";

interface OptionBrand {
  id: number;
  name: string;
}

interface OptionCategory {
  id: number;
  name: string;
}

type SortFieldKey = "createdDate" | "price" | "quantity" | "views";

interface Product {
  id: number;
  productName: string;
  price: number;
  quantitySold: number;
  images: { directoryPath: string }[];
  percentageReduction?: string;
}

export default function Products() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [activeIndexBrand, setActiveIndexBrand] = useState<number | null>(null);
  const [activeIndexType, setActiveIndexType] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [sortOrders, setSortOrders] = useState<
    Record<SortFieldKey, "asc" | "desc">
  >({
    createdDate: "asc",
    price: "asc",
    quantity: "asc",
    views: "asc",
  });
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  const [brandOptions, setBrandOptions] = useState<OptionBrand[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<OptionCategory[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Load brands + default products
  useEffect(() => {
    getAllBrands();
    handleSearchProducts();
  }, []);

  // When brand changes -> load categories
  useEffect(() => {
    if (selectedBrandId) {
      fetchCategoriesByProductTypeId(selectedBrandId);
    }
  }, [selectedBrandId]);

  const getAllBrands = () => {
    setLoading(true);
    getProductTypeByStatus({ status: "true" })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: OptionBrand[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));
        setBrandOptions(mappedOptions);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thương hiệu:", error);
      })
      .finally(() => setLoading(false));
  };

  const fetchCategoriesByProductTypeId = (value: string | null) => {
    getCategorysByProductTypeId({
      productTypeId: value,
      status: null,
    })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: OptionCategory[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));
        setCategoryOptions(mappedOptions);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
      });
  };

  const handleSearchProducts = () => {
    setLoading(true);
    ProductSearch({
      productTypeId: selectedBrandId,
      name: "",
      minPrice: minPrice,
      maxPrice: maxPrice,
      status: "true",
      categoryId: selectedCategoryId,
      orderBy: "asc",
      priceOrder: "asc",
      page: 1,
      size: 100, // lấy nhiều để phân trang local
      quantitySold: "",
      numberOfVisits: "",
      evaluate: null,
    })
      .then((response) => {
        const data = response?.data || [];
        setProducts(data);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      })
      .finally(() => setLoading(false));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

    const handleViewProductDetail = (id: number) => {
    navigate(`/product-detail/${id}`);
  };

  const visibleCompanies = showAllBrands
    ? brandOptions
    : brandOptions?.slice(0, 5);

  const visibleFields = showAll ? sortFields : sortFields.slice(0, 1);

  if (loading) return <Loading />;

  return (
    <div className="main-content">
      <div className="products-content">
        <div className="products-search-results">
          <div className="phone-company-search">
            {/* --- Nhóm hãng --- */}
            <div className="phone-company-search-title">
              <FaBars className="icon-bars" />
              {t("all_phone_brands")}
            </div>

            <div className="phone-company-search-list">
              {visibleCompanies.map((company, index) => (
                <div
                  key={company.id}
                  className={`phone-company-search-item ${
                    activeIndexBrand === index ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveIndexBrand(index);
                    setSelectedBrandId(company.id.toString());
                    handleSearchProducts();
                  }}
                >
                  <div className="phone-company-search-item-logo">
                    {activeIndexBrand === index && <FaChevronRight size={12} />}
                  </div>
                  <div className="phone-company-search-item-name">
                    {company.name}
                  </div>
                </div>
              ))}

              {brandOptions.length > 5 && (
                <div
                  className="phone-company-toggle"
                  onClick={() => setShowAllBrands(!showAllBrands)}
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
              {categoryOptions.map((productType, index) => (
                <div
                  key={productType.id}
                  className={`phone-company-search-item ${
                    activeIndexType === index ? "active" : ""
                  }`}
                  onClick={() => {
                    handleItemClick(index);
                    handleSearchProducts();
                  }}
                >
                  <div className="phone-company-search-item-logo">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(productType.id)}
                      onChange={() => handleCheckboxChange(productType.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {activeIndexType === index && <FaChevronRight size={12} />}
                  </div>
                  <div className="phone-company-search-item-name">
                    {productType.name}
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
                <Input
                  placeholder={t("from")}
                  className="input-price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span style={{ margin: "0 5px" }}>-</span>
                <Input
                  placeholder={t("to")}
                  className="input-price"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="phone-company-search-list-price-button">
                <button className="btn-apply-filters" onClick={handleSearchProducts}>
                  {t("apply_filters")}
                </button>
              </div>
            </div>

            {/* --- Đánh giá --- */}
            <div className="phone-company-search-list-evaluate">
              <div>{t("evaluate")}</div>
              <RatingFilter
                onSelect={(rating) => console.log("Đã chọn:", rating)}
              />
            </div>

            {/* --- Sắp xếp --- */}
            <div className="phone-company-search-list-sort">
              <div>{t("sort_by")}</div>
              <div className="phone-company-search-list-sort-options">
                {visibleFields.map(({ key, label }) => (
                  <div
                    key={key}
                    className="phone-company-search-list-sort-options-item"
                  >
                    <div style={{ width: "150px" }}>{label}</div>
                    <div
                      onClick={() => toggleSort(key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      {sortOrders[key] === "asc" ? (
                        <FaArrowDownWideShort
                          style={{ marginRight: "5px", color: "#ff6b6b" }}
                        />
                      ) : (
                        <FaArrowUpShortWide
                          style={{ marginRight: "5px", color: "#007bff" }}
                        />
                      )}
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    marginTop: "10px",
                    cursor: "pointer",
                    color: "#007bff",
                    fontSize: "13px",
                  }}
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? t("hide") : t("show_more")}
                </div>
              </div>
            </div>
          </div>

          {/* --- Reset filters --- */}
          <div className="products-search-button">
            <button className="btn-apply-filters" onClick={() => window.location.reload()}>
              {t("reset_all")}
            </button>
          </div>
        </div>

        {/* --- Danh sách sản phẩm --- */}
        <div className="products-container-list">
          <div className="products-data-list">
            {currentProducts.map((product) => (
              <div className="product-card" key={product.id}  onClick={() => product?.id && handleViewProductDetail(product.id)}>
                {product.percentageReduction && (
                  <div className="discount-badge">
                    -{product.percentageReduction}%
                  </div>
                )}

                <img
                  src={product.images[0]?.directoryPath}
                  alt={product.productName}
                />

                <div className="product-info">
                  <div className="product-name">{product.productName}</div>
                  <div className="product-rating-buy">
                    <div className="product-price">{product.price}</div>
                  </div>
                  <div className="product-meta">
                    <span>Đã bán {product.quantitySold}</span>
                    <span>⭐ 4.6</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- Phân trang --- */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
