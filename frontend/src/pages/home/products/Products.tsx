import { useEffect, useState } from "react";
import { ProductSearch } from "../../../api/product";
import Button from "../../../components/common/button/Button";
import "./Products.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/common/loading/Loading";

interface Product {
  id?: number;
  productName?: string;
  price?: number;
  quantitySold?: number;
  images?: { directoryPath: string }[];
  discountedPrice?: number;
}

export default function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    handleSearchProducts();
  }, []);

  const handleSearchProducts = () => {
    setLoading(true);
    ProductSearch({
      productTypeId: null,
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

  const handleViewProductDetail = (id: number) => {
    navigate(`/product-detail/${id}`);
  };

  const handleViewAllProducts = () => {
    navigate("/products");
  };

  function formatSold(value?: number): string {
    if (value === undefined || value === null) return "0";
    if (value < 1000) return value.toString();
    if (value < 1_000_000)
      return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="product-content">
      <div className="product-title">{t("home.product.title")}</div>
      <div className="product-data">
        {products?.slice(0, 48).map((item) => (
          <div
            key={item?.id}
            className="product-card"
            onClick={() => item?.id && handleViewProductDetail(item.id)}
          >
            {item?.discountedPrice && (
              <div className="discount-badge-product">
                -{item?.discountedPrice}%
              </div>
            )}
            <img
              src={item?.images?.[0]?.directoryPath}
              alt={item?.productName}
              className="product-img"
            />
            <div>
              <div className="product-name-product">{item?.productName}</div>
              <div className="product-quantity-price">
                <div className="product-price-product">
                  {item?.price}
                  <span className="currency-symbol">đ</span>
                </div>

                <div className="product-quantity-sold">
                  {t("product_sold")} {formatSold(item?.quantitySold)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="product-view-all">
        <Button
          width="15%"
          variant="login-often"
          onClick={handleViewAllProducts}
          disabled={products?.length < 48}
        >
          {t("home.product.view_all")}
        </Button>
      </div>
    </div>
  );
}
