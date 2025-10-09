import './User.css';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from "../../assets/quickbuyshop.png";
import { FaEdit } from 'react-icons/fa';
import { FaReceipt, FaUser } from 'react-icons/fa6';

const User = () => {
    const { t } = useTranslation();
    const [userInfo, setUserInfo] = useState(null);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMenu = (menuName: string) => {
        if (openMenu === menuName) {
            setOpenMenu(null);
        } else {
            setOpenMenu(menuName);

            // 👇 Khi click lần đầu vào "profile", tự điều hướng đến /user/profile
            if (menuName === "profile" && !location.pathname.includes("profile")) {
                navigate("/user/profile");
            }
        }
    };

    // Khi chuyển route khác thì tự đóng menu
    useEffect(() => {
        setOpenMenu(null);
    }, [location.pathname]);

    // Giữ mở menu khi đang ở /user/profile/*
    useEffect(() => {
        if (location.pathname.includes("/user/profile")) {
            setOpenMenu("profile");
        }
    }, [location.pathname]);

    return (
        <div className="main-content">
            <div className="user-container">
                <div className="user-header">
                    <div className="user-title">
                        <div className="user-avatar">
                            <img src={logo} alt="User Avatar" />
                        </div>
                        <div className="user-text">
                            <div className='user-name'>vietnq</div>
                            <div className='user-edit'>
                                <FaEdit size={12} />
                                Chỉnh sửa
                            </div>
                        </div>
                    </div>
                    <aside className="user-sidebar">
                        <div className="user-sidebar-item">
                            <div
                                className="user-sidebar-link"
                                onClick={() => toggleMenu("profile")}
                            >
                                <div className="user-sidebar-icon">
                                    <FaUser size={16} />
                                </div>
                                <div className="user-sidebar-text">{t("my_account")}</div>
                            </div>

                            {openMenu === "profile" && (
                                <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
                                    <div style={{ width: '20%' }}></div>
                                    <div className="user-submenu">
                                        <NavLink
                                            to="/user/profile"
                                            end
                                            className={({ isActive }) =>
                                                `user-submenu-link ${isActive ? "active" : ""}`
                                            }
                                        >
                                            {t("personal_info")}
                                        </NavLink>

                                        <NavLink
                                            to="/user/profile/password"
                                            className={({ isActive }) =>
                                                `user-submenu-link ${isActive ? "active" : ""}`
                                            }
                                        >
                                            {t("change_password")}
                                        </NavLink>

                                        <NavLink
                                            to="/user/profile/address"
                                            className={({ isActive }) =>
                                                `user-submenu-link ${isActive ? "active" : ""}`
                                            }
                                        >
                                            {t("profile_address")}
                                        </NavLink>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="user-sidebar-item">
                            <NavLink to="purchases" className="user-sidebar-link">
                                <div className="user-sidebar-icon">
                                    <FaReceipt size={16} />
                                </div>
                                <div className="user-sidebar-text">{t("my_purchases")}</div>
                            </NavLink>
                        </div>
                    </aside>
                </div>
                <main className="user-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default User;
