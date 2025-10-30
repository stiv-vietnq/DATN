import Button from '../../../components/common/button/Button';
import './Products.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Products() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const products = [
        {
            id: 1,
            name: 'Product 1',
            img: 'https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg',
            price: '$10.00'
        },
        {
            id: 2,
            name: 'Product 2',
            img: 'https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg',
            price: '$10.00'
        },
        {
            id: 3,
            name: 'Product 3',
            img: 'https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg',
            price: '$10.00'
        },
        {
            id: 4,
            name: 'Product 4',
            img: 'https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg',
            price: '$10.00'
        },
        {
            id: 5,
            name: 'Product 5',
            img: 'https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg',
            price: '$10.00'
        },
        {
            id: 5,
            name: 'Product 5',
            img: 'https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg',
            price: '$10.00'
        },
        {
            id: 6,
            name: 'Product 6',
            img: 'https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg',
            price: '$10.00'
        },
        {
            id: 7,
            name: 'Product 7',
            img: 'https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg',
            price: '$10.00'
        },
        {
            id: 8,
            name: 'Product 8',
            img: 'https://shopdunk.com/images/thumbs/0012145_iphone-11-pro-256gb.jpeg',
            price: '$10.00'
        }
    ];

    const handleViewProductDetail = (id: number) => {
        navigate(`/product-detail/${id}`);
    };

    const handleViewAllProducts = () => {
        navigate('/products');
    };

    return (
        <div className="product-content">
            <div className='product-title'>
                {t('home.product.title')}
            </div>
            <div className='product-data'>
                {products?.slice(0, 48).map((item) => (
                    <div key={item?.id} className="product-card" onClick={() => handleViewProductDetail(item?.id)}>
                        <img src={item?.img} alt={item?.name} className="product-img" />
                        <div className="product-name">{item?.name}</div>
                    </div>
                ))}
            </div>
            <div className='product-view-all'>
                <Button width="15%" variant="login-often" onClick={handleViewAllProducts} disabled={products?.length < 1}>
                    {t("home.product.view_all")}
                </Button>
            </div>
        </div>
    );
}