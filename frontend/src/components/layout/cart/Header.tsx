import "./Header.css";
import logo from "../../../assets/quickbuyshop.png";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <header className="quickbuy-top-auth quickbuy-top-auth--sticky">
      <div className="navbar-wrapper-auth">
        <div className="container-wrapper-auth">
          <div className="navbar-logo" onClick={handleLogoClick}>
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
          <div className="navbar-title">Giỏ hàng</div>
        </div>
      </div>
    </header>
  );
}
