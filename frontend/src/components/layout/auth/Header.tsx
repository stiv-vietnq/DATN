import "./Header.css";
import logo from "../../../assets/quickbuyshop.png";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();

  const path = location.pathname;

  let title = "";
  if (path === "/login") {
    title = t("login");
  } else if (path === "/register") {
    title = t("register");
  } else if (path === "/forgot-password") {
    title = t("forgot_password_title");
  } else if (path === "/verify") {
    title = t("verify");
  }

  return (
    <header className="quickbuy-top-auth quickbuy-top-auth--sticky">
      <div className="navbar-wrapper-auth">
        <div className="container-wrapper-auth">
          <div className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
           <div className="navbar-title">{title}</div>
          <div className="navbar-note">
            <div className="navbar-note-title">{t("help")}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
