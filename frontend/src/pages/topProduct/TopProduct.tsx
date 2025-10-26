import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './TopProduct.css';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  sold: number;
  rating: number;
  image: string;
  topRank?: number;
}

export default function TopProduct() {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Quạt Mini Cầm Tay" },
    { id: 2, name: "Áo Thun" },
    { id: 3, name: "Áo Ngực Không Dây" },
    { id: 4, name: "Bao Cao Su" },
    { id: 5, name: "Áo Lót Nữ Không Gọng" },
    { id: 6, name: "Dép Đi Trong Nhà" },
    { id: 7, name: "Áo Khoác" },
    { id: 8, name: "Túi Xách" },
    { id: 9, name: "Giày Dép" },
  ]);

  const mainCategories = categories.slice(0, 6);
  const moreCategories = categories.slice(6);

  const [activeId, setActiveId] = useState<number | null>(mainCategories[0].id);
  const [showMore, setShowMore] = useState(false);

  const handleClickMore = () => {
    setShowMore(!showMore);
  };

  const handleSelect = (selected: Category, index: number) => {
    const newCategories = [...categories];

    if (index >= 6) {
      const [selectedItem] = newCategories.splice(index, 1);

      newCategories.unshift(selectedItem);

      setCategories(newCategories);
      setActiveId(selectedItem.id);
    } else {
      setActiveId(selected.id);
    }

    setShowMore(false);
    console.log("Chọn danh mục:", selected.id, selected.name);
  };

  const productList: Product[] = [
    { id: 1, name: "Tủ Đầu Giường Có Ngăn Khóa", price: 104999, sold: 1007, rating: 4.8, image: "https://cdn.24h.com.vn/upload/3-2021/images/2021-09-15/1-1631647537-638-width650height520.jpg" },
    { id: 2, name: "Tủ Đầu Giường Gỗ MDF", price: 105000, sold: 801, rating: 4.6, image: "https://cdn.24h.com.vn/upload/3-2021/images/2021-09-15/1-1631647537-638-width650height520.jpg" },
    { id: 3, name: "Tủ Đầu Giường Có Khóa An Toàn", price: 125000, sold: 352, rating: 4.9, image: "https://cdn.24h.com.vn/upload/3-2021/images/2021-09-15/1-1631647537-638-width650height520.jpg"},
    { id: 4, name: "Kệ Đầu Giường Tab Gỗ", price: 159000, sold: 251, rating: 4.7, image: "https://cdn.24h.com.vn/upload/3-2021/images/2021-09-15/1-1631647537-638-width650height520.jpg" },
    { id: 5, name: "Tủ Tab Gỗ Nhiều Kiểu Dáng", price: 109000, sold: 229, rating: 4.5, image: "https://cdn.24h.com.vn/upload/3-2021/images/2021-09-15/1-1631647537-638-width650height520.jpg" },
    { id: 6, name: "Kệ Gỗ Đa Năng Phòng Khách", price: 205000, sold: 130, rating: 4.8, image: "https://cdn.24h.com.vn/upload/3-2021/images/2021-09-15/1-1631647537-638-width650height520.jpg" },
  ];
  
  const topRanked = useMemo(() => {
    return (
      [...productList]
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 30) 
        .map((p, index) => ({
          ...p,
          rank: index + 1,
        }))
    );
  }, [productList]);

  return (
    <div className="main-content">
      <div className='top-product-container'>
        <div className='top-product-title'>
          {t('top_search')}
        </div>

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
          {topRanked.map((p) => (
            <div key={p.id} className="product-card">
              {p.rank && <div className={`top-rank rank-${p.rank}`}>TOP {p.rank}</div>}
              <img src={p.image} alt={p.name} className="product-img" />
              <div className="product-info">
                <p className="product-name">{p.name}</p>
                <p className="product-price">{p.price.toLocaleString()}₫</p>
                <div className="product-meta">
                  <span>Đã bán {p.sold}</span>
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
