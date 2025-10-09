import { useLocation } from 'react-router-dom';
import './TopProduct.css';
import { useTranslation } from 'react-i18next';

export default function TopProduct() {
    const { t } = useTranslation();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const catId = params.get("catId");
    return (
        <div className="main-content">
            <div>Product ID: {catId}</div>
        </div>
    );
}