import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./TopProduct.css";
import { getProductTypeById, getProductTypeByStatus } from "../../api/brand";
import Loading from "../../components/common/loading/Loading";

interface BrandData {
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
  const [searchParams] = useSearchParams();
  const brandIdFromUrl = searchParams.get("brandId");
  const [activeId, setActiveId] = useState<number | null>(
    brandIdFromUrl ? Number(brandIdFromUrl) : null
  );
  const [brandId, setBrandId] = useState<string | null>(brandIdFromUrl);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllBrands();
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

        // Nếu URL không có brandId, chọn brand đầu tiên
        const initialBrandId =
          brandIdFromUrl && mappedOptions.some((b) => b.id === Number(brandIdFromUrl))
            ? Number(brandIdFromUrl)
            : mappedOptions[0]?.id;

        if (initialBrandId) {
          setActiveId(initialBrandId);
          setBrandId(initialBrandId.toString());
          handleSearchProducts(initialBrandId);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thương hiệu:", error);
      });
  };

  const handleSearchProducts = (id?: number) => {
    const searchId = id ?? (brandId ? Number(brandId) : null);
    if (!searchId) return;

    setLoading(true);
    getProductTypeById(searchId)
      .then((response) => {
        const data = response?.data || [];
        setProducts(data);
      })
      .catch((error) => {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      })
      .finally(() => setLoading(false));
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

  console.log("topRanked", topRanked);
  

  const mainCategories = brands?.slice(0, 6);
  const moreCategories = brands?.slice(6);

  const handleClickMore = () => setShowMore(!showMore);

  const handleSelect = (selected: BrandData, index: number) => {
    const newCategories = [...brands];
    let selectedId = selected.id;

    if (index >= 6) {
      const [selectedItem] = newCategories.splice(index, 1);
      newCategories.unshift(selectedItem);
      selectedId = selectedItem.id;
      setBrands(newCategories);
    }

    setActiveId(selectedId);
    setBrandId(selectedId.toString());
    handleSearchProducts(selectedId);
    setShowMore(false);
  };

  const handleViewProductDetail = (id: number) => {
    navigate(`/product-detail/${id}`);
  };

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
                className={`top-product-item ${activeId === item.id ? "active" : ""}`}
                onClick={() => handleSelect(item, index)}
              >
                {item.name}
              </div>
            ))}

            {moreCategories.length > 0 && (
              <div className="top-product-item see-more" onClick={handleClickMore}>
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
          {topRanked.map((p) => (
            <div key={p.id} className="product-card" onClick={() => handleViewProductDetail(p?.id)}>
              {p.rank && <div className={`top-rank rank-${p.rank}`}>TOP {p.rank}</div>}
              <img
                src={p.images?.[0]?.directoryPath}
                alt={p.productName}
                className="product-img"
              />
              <div className="product-info">
                <p className="product-name">{p.productName}</p>
                <p className="product-price">{p.price.toLocaleString()}₫</p>
                <div className="product-meta">
                  <span>Đã bán {p.quantitySold}</span>
                  <span>⭐ {p.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
