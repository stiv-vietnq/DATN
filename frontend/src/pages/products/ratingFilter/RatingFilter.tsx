import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./RatingFilter.css";
import { useTranslation } from "react-i18next";

interface RatingFilterProps {
    onSelect?: (rating: number) => void;
}

const RatingFilter = ({ onSelect }: RatingFilterProps) => {
    const { t } = useTranslation();
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [showAll, setShowAll] = useState<boolean>(false);

    const handleSelect = (rating: number) => {
        setSelectedRating(rating);
        if (onSelect) onSelect(rating);
    };

    // Hiển thị 2 cái đầu tiên nếu chưa bấm "xem thêm"
    const ratings = [5, 4, 3, 2, 1];
    const visibleRatings = showAll ? ratings : ratings.slice(0, 2);

    return (
        <div className="phone-company-search-list-evaluate-input">
            {visibleRatings.map((rating) => (
                <div
                    key={rating}
                    className={`rating-item ${selectedRating === rating ? "active" : ""}`}
                    onClick={() => handleSelect(rating)}
                >
                    <div className="stars">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                color={index < rating ? "#f1d100ff" : "#ddd"}
                                size={16}
                            />
                        ))}
                    </div>
                    {rating < 5 && <span className="rating-text">{t("rating")}</span>}
                </div>
            ))}

            <div
                className="rating-toggle"
                onClick={() => setShowAll((prev) => !prev)}
            >
                {showAll ? t("hide") : t("show_more")}
            </div>
        </div>
    );
};

export default RatingFilter;
