import { useTranslation } from "react-i18next";
import "./Home.css";
import TopSearch from "./topSearch/TopSearch";

export default function Home() {
    const { t } = useTranslation();
    return (
        <div className="main-content">
           <TopSearch />
        </div>
    );
}
