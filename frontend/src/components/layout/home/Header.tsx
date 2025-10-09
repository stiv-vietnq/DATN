import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { AiFillFacebook } from 'react-icons/ai';
import { FaChevronDown, FaQuestionCircle, FaShoppingCart } from "react-icons/fa";
import { SiInstagram, SiZalo } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/quickbuyshop.png";
import Loading from '../../common/loading/Loading';
import NavbarSearch from '../../common/navbarSearch/NavbarSearch';
import './Header.css';
import Button from '../../common/button/Button';

export default function Header() {

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const token = '';
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Product 1Product 1Product 1Product 1Product 1Product 1Product 1', img: logo, price: 1000 },
        { id: 2, name: 'Product 2', img: logo, price: 2000 },
        { id: 3, name: 'Product 3', img: logo, price: 3000 }
    ]);

    const getLanguageLabel = () => {
        return i18n.language === "vi" ? "Tiếng Việt" : "English";
    };

    const changeLanguage = (lng: string | undefined) => {
        setLoading(true);
        i18n.changeLanguage(lng).then(() => {
            setTimeout(() => {
                setLoading(false);
            }, 200);
        });
    };

    const handleNavigate = (path: string) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate(path);
        }, 200);
    };

    if (loading) return <Loading />;

    return (
        <header className="quickbuy-top quickbuy-top--sticky">
            <div className="navbar-wrapper">
                <div className="container-wrapper">
                    <div className="navbar-container">
                        <div className="navbar-container-connect">
                            <div className="navbar-container-connect-item">{t('connect')}</div>
                            <div className="navbar-container-connect-item">
                                <div className="navbar-container-connect-icon zalo">
                                    <SiZalo size={28} />
                                </div>

                                <div className="navbar-container-connect-icon facebook">
                                    <AiFillFacebook size={28} />
                                </div>

                                <div className="navbar-container-connect-icon instagram">
                                    <SiInstagram size={28} />
                                </div>
                            </div>
                        </div>
                        <div className="navbar-container-account">
                            <div className="navbar-container-account-item">1</div>
                            <div className="navbar-container-account-item">
                                <FaQuestionCircle size={14} />
                                <div className="navbar-container-connect-item">
                                    {t('support')}
                                </div>
                            </div>
                            <div className="navbar-container-account-item">
                                {i18n.language === "vi" ? (
                                    <ReactCountryFlag
                                        countryCode="VN"
                                        svg
                                        style={{ width: "16px", height: "16px" }}
                                    />
                                ) : (
                                    <ReactCountryFlag
                                        countryCode="GB"
                                        svg
                                        style={{ width: "16px", height: "16px" }}
                                    />
                                )}
                                <div className="navbar-container-connect-item">
                                    {getLanguageLabel()}
                                </div>
                                <FaChevronDown size={14} />
                                <ul className="language-popup">
                                    <li onClick={() => changeLanguage("vi")}>
                                        <ReactCountryFlag countryCode="VN" svg style={{ width: "14px", height: "14px" }} />
                                        Tiếng Việt</li>
                                    <li onClick={() => changeLanguage("en")}>
                                        <ReactCountryFlag countryCode="GB" svg style={{ width: "14px", height: "14px" }} />
                                        English</li>
                                </ul>
                            </div>

                            <div className="navbar-container-account-item">
                                {token ? (
                                    <div>
                                        <div className="navbar-container-account-item">
                                            <div className="avatar">
                                                <img
                                                    src="https://i.pravatar.cc/300"
                                                    alt="Avatar"
                                                />
                                            </div>
                                            <div className="username">
                                                vietnq
                                            </div>

                                            <ul className="user-popup">
                                                <li onClick={() => handleNavigate("/user/profile")}>{t('my_account')}</li>
                                                <li onClick={() => handleNavigate("/user/purchases")}>{t('my_purchases')}</li>
                                                <li>{t('logout')}</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <div className="navbar-container-account-item" onClick={() => handleNavigate("/login")}>
                                            {t('login')}
                                        </div>

                                        <div style={{ color: "white", cursor: "default" }}>|</div>

                                        <div className="navbar-container-account-item" onClick={() => handleNavigate("/register")}>
                                            {t('register')}
                                        </div>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>
                    <div className="navbar-header">
                        <div className="navbar-header-logo" onClick={() => handleNavigate("/")}>
                            <img src={logo} alt="Logo" className="logo-image-1" />
                        </div>

                        <div className="navbar-header-search">
                            <NavbarSearch />
                        </div>

                        <div className='navbar-header-cart-container'>
                            <div className="navbar-header-cart">
                                <FaShoppingCart className='cart-icon' />
                                <span className="cart-badge">{cartItems?.length}</span>

                                <div className="cart-popup"
                                    style={{
                                        maxHeight: cartItems?.length > 0 ? "350px" : "200px",
                                        height: cartItems?.length > 0 ? "auto" : "200px",
                                    }}
                                >
                                    <div className="cart-popup-arrow"></div>
                                    {cartItems?.length === 0 ? (
                                        <div className="cart-popup-empty">
                                            <div className="cart-popup-empty-icon">
                                                <FaShoppingCart size={50} color='#fb8016' />
                                            </div>
                                            <div className="cart-popup-empty-text">
                                                {t('cart_empty')}
                                            </div>
                                        </div>
                                    ) : (
                                        <ul className="cart-popup-list">
                                            <div className='cart-popup-list-header'>{t('cart')}</div>
                                            {cartItems?.map((item) => (
                                                <div className='cart-popup-item' key={item?.id}>
                                                    <div className='cart-popup-item-image'>
                                                        <img src={item?.img} alt={item?.name} />
                                                    </div>
                                                    <div className='cart-popup-item-name'>{item?.name}</div>
                                                    <div className='cart-popup-item-price'>
                                                        {item?.price}
                                                        <span className="currency-symbol">đ</span>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className='cart-popup-footer'>
                                                {cartItems?.length} {t('product')}
                                                <Button className='btn-login-often' onClick={() => handleNavigate("/cart")}>{t('view_cart')}</Button>
                                            </div>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header >
    );
}
