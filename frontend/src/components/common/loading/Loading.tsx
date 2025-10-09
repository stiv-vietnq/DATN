import { useTranslation } from "react-i18next";
import "./Loading.css";

export default function Loading() {
    const { t } = useTranslation();
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
            <p className="loading-text">{t("loading")}<span className="dots"></span></p>
        </div>
    );
}
