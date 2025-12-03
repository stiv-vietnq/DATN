import "./Header.css";
import logo from "../../../assets/quickbuyshop.png";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate("/home");
  };

  const getTitle = () => {
    if (location.pathname.startsWith("/cart")) return t("cart");
    if (location.pathname.startsWith("/purchases")) return t("purchase");
    if (location.pathname.startsWith("/purchases-success")) return t("purchase_success");
    if (location.pathname.startsWith("/purchase-notify")) return t("purchase-notify");
    if (location.pathname.startsWith("/payment-failed")) return t("payment_failed");
    return "";
  };

  return (
    <header className="quickbuy-top-auth quickbuy-top-auth--sticky">
      <div className="navbar-wrapper-auth">
        <div className="container-wrapper-auth">
          <div className="navbar-logo" onClick={handleLogoClick}>
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
          <div className="navbar-title">{getTitle()}</div>
        </div>
      </div>
    </header>
  );
}
