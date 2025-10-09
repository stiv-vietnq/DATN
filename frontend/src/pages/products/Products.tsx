import './Products.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Loading from '../../components/common/loading/Loading';

export default function Products() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    if (loading) return <Loading />;

    return (
        <div className="main-content">
            vietnq
        </div>
    );
}