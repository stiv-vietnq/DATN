import { FaChevronRight } from 'react-icons/fa6';
import './TopSearch.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function TopSearch() {
    const { t } = useTranslation();
    const navigate = useNavigate();


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
            </div>
        </div>
    );
}