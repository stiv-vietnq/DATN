import { useEffect, useState } from "react";
import "./productDetail.css";

const banners = [
    'https://cdn.tgdd.vn/Files/2023/09/13/1547133/1-300923-014812.jpg',
    'https://cdn.24h.com.vn/upload/3-2021/images/2021-09-15/1-1631647537-638-width650height520.jpg',
    'https://cdn.24h.com.vn/upload/3-2021/images/2021-09-15/scr-1631646603-272-width650height476.jpg',
    'https://cdn.24h.com.vn/upload/3-2021/images/2021-09-15/scr-3-1631646603-450-width650height467.jpg',
];

export default function Banner() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="banner-container">
            {banners.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt={`Banner ${index + 1}`}
                    className={`banner-image ${index === current ? "active" : ""}`}
                />
            ))}

            <div className="banner-dots">
                {banners.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === current ? "active" : ""}`}
                        onClick={() => setCurrent(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}
