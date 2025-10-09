import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import './TopSearch.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/quickbuyshop.png';
import { useState } from 'react';

const products = [
    { id: 1, name: "Điện Thoại Apple", sold: "6k+", img: logo },
    { id: 2, name: "Đầm Ren", sold: "2k+", img: logo },
    { id: 3, name: "Áo Babydoll Nữ Tay Bèo", sold: "71k+", img: logo },
    { id: 4, name: "Gấu Bông Vịt", sold: "6k+", img: logo },
    { id: 5, name: "Thú Nhồi Bông", sold: "4k+", img: logo },
    { id: 6, name: "Váy Đi Biển", sold: "3k+", img: logo },
    { id: 7, name: "Váy Đi Biển", sold: "3k+", img: logo },
    { id: 8, name: "Váy Đi Biển", sold: "3k+", img: logo },
];

export default function TopSearch() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 6;

    const handleNext = () => {
        if (currentIndex < products.length - itemsPerPage) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);

    const handleSearchTopProducts = (id: any) => {
        navigate(`/top-products?catId=${id}`);
    };

    const handleViewAll = () => {
        navigate('/top-products');
    }

    return (
        <div className="top-search">
            <div className="top-search-container">
                <div className="top-search-header">
                    <div className="top-search-title">
                        {t("top_search")}
                    </div>
                    <div className="top-search-view-all">
                        <div className='view-all-button' onClick={handleViewAll}>
                            {t("view_all")}
                            <FaChevronRight />
                        </div>
                    </div>
                </div>
                <div className="topsearch-container">
                    <div className="topsearch-wrapper">
                        {currentIndex > 0 && (
                            <div
                                className="nav-button prev-button"
                                onClick={handlePrev}
                            >
                                <FaChevronLeft />
                            </div>
                        )}

                        <div className="topsearch-list">
                            {visibleProducts.map((item) => (
                                <div key={item?.id} className="topsearch-item" onClick={() => handleSearchTopProducts(item?.id)}>
                                    <div className="product-image">
                                        <span className="tag-top">TOP</span>
                                        <img src={item?.img} alt={item?.name} />
                                        <div className="sold-text">Bán {item?.sold} / tháng</div>
                                    </div>
                                    <div className="topsearch-name">{item?.name}</div>
                                </div>
                            ))}
                        </div>

                        {currentIndex < products.length - itemsPerPage && (
                            <div
                                className="nav-button next-button"
                                onClick={handleNext}
                            >
                                <FaChevronRight />
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
}