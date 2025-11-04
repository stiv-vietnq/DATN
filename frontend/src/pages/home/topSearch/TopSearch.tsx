import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./TopSearch.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductTypeByStatus } from "../../../api/brand";

const products = [
  {
    id: 1,
    name: "Điện Thoại Apple",
    sold: "6k+",
    directoryPath:
      "https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg",
  },
  {
    id: 2,
    name: "Đầm Ren",
    sold: "2k+",
    directoryPath:
      "https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg",
  },
];

interface BrandData {
  id: number;
  name: string;
  directoryPath: string;
}

export default function TopSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;
  const [brands, setBrands] = useState<BrandData[]>([]);

  useEffect(() => {
    getAllBrands();
  }, []);

  const getAllBrands = () => {
    getProductTypeByStatus({ status: 'true' })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: BrandData[] = data.map((item: any) => ({
          id: item?.id,
          name: item?.name,
          directoryPath: item?.directoryPath,
        }));
        setBrands(mappedOptions);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thương hiệu:", error);
      });
  };

  const handleNext = () => {
    if (currentIndex < brands.length - itemsPerPage) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleProducts = brands.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const handleSearchTopProducts = (id: any) => {
    navigate(`/top-products?catId=${id}`);
  };

  const handleViewAll = () => {
    navigate("/top-products");
  };

  return (
    <div className="top-search">
      <div className="top-search-container">
        <div className="top-search-header">
          <div className="top-search-title">{t("top_search")}</div>
          <div className="top-search-view-all">
            <div className="view-all-button" onClick={handleViewAll}>
              {t("view_all")}
              <FaChevronRight />
            </div>
          </div>
        </div>
        <div className="topsearch-container">
          <div className="topsearch-wrapper">
            {currentIndex > 0 && (
              <div className="nav-button prev-button" onClick={handlePrev}>
                <FaChevronLeft />
              </div>
            )}

            <div className="topsearch-list">
              {visibleProducts.map((item) => (
                <div
                  key={item?.id}
                  className="topsearch-item"
                  onClick={() => handleSearchTopProducts(item?.id)}
                >
                  <div className="product-image">
                    {/* <span className="tag-top">TOP</span> */}
                    <img src={item?.directoryPath} alt={item?.name} />
                    {/* <div className="sold-text">Bán {item?.sold} / tháng</div> */}
                  </div>
                  <div className="topsearch-name">{item?.name}</div>
                </div>
              ))}
            </div>

            {currentIndex < products.length - itemsPerPage && (
              <div className="nav-button next-button" onClick={handleNext}>
                <FaChevronRight />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
