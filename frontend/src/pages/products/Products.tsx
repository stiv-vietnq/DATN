import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBars, FaChevronRight, FaFilter } from "react-icons/fa6";
import Loading from "../../components/common/loading/Loading";
import "./Products.css";

const phoneCompanies = ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo"];

export default function Products() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (loading) return <Loading />;

  return (
    <div className="main-content">
      <div className="products-content">
        <div className="products-search-results">
          <div className="phone-company-search">
            <div className="phone-company-search-title">
              <FaBars className="icon-bars" />
              Tất cả hãng điện thoại
            </div>
            <div className="phone-company-search-list">
              {phoneCompanies.map((company, index) => (
                <div
                  key={company}
                  className={`phone-company-search-item ${
                    activeIndex === index ? "active" : ""
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="phone-company-search-item-logo">
                    {activeIndex === index && <FaChevronRight />}
                  </div>
                  <div className="phone-company-search-item-name">
                    {company}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="phone-company-search-title"
              style={{ marginTop: "20px" }}
            >
              <FaFilter className="icon-bars" />
              Loại sản phẩm
            </div>

            <div
              className="phone-company-search-title"
              style={{ marginTop: "20px" }}
            >
              <FaFilter className="icon-bars" />
              Bộ lọc tìm kiếm
            </div>
          </div>
        </div>
        <div className="products-data-list">vietnq</div>
      </div>
    </div>
  );
}
