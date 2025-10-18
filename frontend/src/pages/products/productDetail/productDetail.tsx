import './productDetail.css'

import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'


export default function ProductDetail() {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>();
    const productId = id ? Number(id) : null;

    return (
        <div className="main-content">
            product detail {productId}
        </div>
    )
}
