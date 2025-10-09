import { useTranslation } from "react-i18next";
import "./Home.css";
import TopSearch from "./topSearch/TopSearch";
import Products from "./products/Products";

export default function Home() {
    const { t } = useTranslation();
    return (
        <div className="main-content">
            <TopSearch />
            <Products />
        </div>
    );
}
