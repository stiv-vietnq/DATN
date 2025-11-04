import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./TopProduct.css";
import { getProductTypeByStatus } from "../../api/brand";
import { ProductSearch } from "../../api/product";
import Loading from "../../components/common/loading/Loading";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  productName: string;
  price: number;
  quantitySold: number;
  rating: number;
  images: { directoryPath: string }[];
  topRank?: number;
}

export default function TopProduct() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<BrandData[]>([]);

  useEffect(() => {
    getAllBrands();
    handleSearchProducts();
  }, []);

  const getAllBrands = () => {
    getProductTypeByStatus({ status: null })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: BrandData[] = data.map((item: any) => ({
          id: item?.id,
          name: item?.name,
        }));
        setBrands(mappedOptions);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thương hiệu:", error);
      });
  };

  useEffect(() => {
    if (brands.length > 0 && activeId === null) {
      setActiveId(brands[0].id);
    }
  }, [brands]);

  const mainCategories = brands?.slice(0, 6);
  const moreCategories = brands?.slice(6);

  interface BrandData {
    id: number;
    name: string;
  }

  const [activeId, setActiveId] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [brandId, setBrandId] = useState<string | null>(null);

  const handleClickMore = () => {
    setShowMore(!showMore);
  };

  const handleSelect = (selected: BrandData, index: number) => {
    const newCategories = [...brands];

    if (index >= 6) {
      const [selectedItem] = newCategories.splice(index, 1);

      newCategories.unshift(selectedItem);

      setBrands(newCategories);
      setActiveId(selectedItem?.id);
      setBrandId(selectedItem?.id.toString());
    } else {
      setActiveId(selected?.id);
      setBrandId(selected?.id.toString());
    }
    handleSearchProducts();
    setShowMore(false);
  };

  const handleSearchProducts = () => {
    setLoading(true);
    ProductSearch({
      productTypeId: brandId,
      name: null,
      minPrice: null,
      maxPrice: null,
      status: null,
      categoryId: null,
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
        setProducts(data);
      })
      .catch((error) => {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const topRanked = useMemo(() => {
    return [...products]
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 30)
      .map((p, index) => ({
        ...p,
        rank: index + 1,
      }));
  }, [products]);

  if (loading) return <Loading />;

  return (
    <div className="main-content">
      <div className="top-product-container">
        <div className="top-product-title">{t("top_search")}</div>

        <div className="top-product-list">
          <div className="top-product-header">
            {mainCategories.map((item, index) => (
              <div
                key={item.id}
                className={`top-product-item ${
                  activeId === item.id ? "active" : ""
                }`}
                onClick={() => handleSelect(item, index)}
              >
                {item.name}
              </div>
            ))}

            {moreCategories.length > 0 && (
              <div
                className="top-product-item see-more"
                onClick={handleClickMore}
              >
                Xem thêm
              </div>
            )}
          </div>

          {showMore && (
            <div className="dropdown-menu">
              {moreCategories.map((item, index) => (
                <div
                  key={item.id}
                  className="dropdown-item"
                  onClick={() => handleSelect(item, 6 + index)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-grid">
          {topRanked?.map((p) => (
            <div key={p?.id} className="product-card">
              {p?.rank && (
                <div className={`top-rank rank-${p?.rank}`}>TOP {p?.rank}</div>
              )}
              <img
                src={p?.images?.[0]?.directoryPath}
                alt={p?.productName}
                className="product-img"
              />
              <div className="product-info">
                <p className="product-name">{p?.productName}</p>
                <p className="product-price">{p?.price.toLocaleString()}₫</p>
                <div className="product-meta">
                  <span>Đã bán {p?.quantitySold}</span>
                  <span>⭐ {p?.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
