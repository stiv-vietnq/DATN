import { FaSearch } from "react-icons/fa";
import "./NavbarSearch.css";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";

function NavbarSearch() {

  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
    }, 200);
  };

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="navbar-header-search-container">
      <input
        type="text"
        placeholder={t("search.placeholder_input_header")}
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="search-button" onClick={handleSearch}>
        <FaSearch />
      </button>
    </div>
  );
}

export default NavbarSearch;
