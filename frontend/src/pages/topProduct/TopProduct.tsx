import { useLocation } from 'react-router-dom';
import './TopProduct.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface Category {
  id: number;
  name: string;
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
      </div>
    </div>
  );
}
