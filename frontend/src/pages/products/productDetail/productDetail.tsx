import { useState } from "react";
import Banner from "./Banner";
import "./productDetail.css";
import logo from "../../../assets//quickbuyshop.png";
import logo2 from "../../../assets//quickbuyshopwhite.png";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import { FaBagShopping, FaCartShopping, FaChevronLeft, FaChevronRight, FaPaperPlane, FaShareNodes, FaXmark } from "react-icons/fa6"
import { useTranslation } from "react-i18next";
import Textarea from "../../../components/common/textarea/Textarea";
import Input from "../../../components/common/input/Input";
import CommentAvatar from "./commentAvatar/CommentAvatar";

export default function ProductDetail() {
    const { t } = useTranslation();
    const [selectedStorage, setSelectedStorage] = useState("12GB/512GB");
    const [selectedColor, setSelectedColor] = useState("Bạc");
    const [selectedImage, setSelectedImage] = useState(logo);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    const storageOptions = [
        { name: "12GB/512GB", price: 6990000 },
        { name: "12GB/256GB", price: 6290000 },
    ];

    const colorOptions = [
        { name: "Xanh Lá", image: logo },
        { name: "Xanh 1", image: logo2 },
        { name: "Xanh 2", image: logo },
        { name: "Xanh 3", image: logo2 },
        { name: "Xanh 4", image: logo },
    ];

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Sản phẩm", path: "/products" },
        { label: "POCO M7 Pro 5G 12GB/512GB" }
    ];

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % colorOptions.length;
        setCurrentIndex(nextIndex);
        setSelectedImage(colorOptions[nextIndex].image);
        setSelectedColor(colorOptions[nextIndex].name);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + colorOptions.length) % colorOptions.length;
        setCurrentIndex(prevIndex);
        setSelectedImage(colorOptions[prevIndex].image);
        setSelectedColor(colorOptions[prevIndex].name);
    };

    const price = storageOptions.find((s) => s.name === selectedStorage)?.price || 0;

    return (
        <div className="main-content" style={{ paddingBottom: "40px" }}>
            <div style={{ width: "70%", margin: "120px auto 0 auto" }}>
                <div className="product-page">
                    <Breadcrumb items={breadcrumbItems} />
                    <Banner />
                    <div className="product-detail-title">
                        Điện thoại Xiaomi POCO M7 Pro 5G 12GB/512GB
                    </div>
                    <div className="product-detail">
                        <div className="product-left">
                            <img src={selectedImage} alt="POCO" className="product-main-img" onClick={() => setShowModal(true)} />

                            <div className="thumbnail-list">
                                {colorOptions?.slice(0, 4).map((c) => (
                                    <div
                                        key={c.name}
                                        className={`thumbnail-item ${selectedColor === c.name ? "active" : ""}`}
                                        onClick={() => {
                                            setSelectedColor(c.name);
                                            setSelectedImage(c.image);
                                        }}
                                    >
                                        <img src={c.image} alt={c.name} />
                                        <p>{c.name}</p>
                                    </div>
                                ))}
                            </div>

                        </div>

                        <div className="product-right">
                            <div className="product-price">
                                <span className="current">{price.toLocaleString()} ₫</span>
                                <span className="old">7.990.000 ₫</span>
                            </div>

                            <div className="option-group">
                                <p className="option-title">{t("product_detail.select_version")}</p>
                                <div className="option-list">
                                    {storageOptions.map((s) => (
                                        <div
                                            key={s.name}
                                            className={`option-item ${selectedStorage === s.name ? "selected" : ""}`}
                                            onClick={() => setSelectedStorage(s.name)}
                                        >
                                            <span>{s.name}</span>
                                            <span className="option-price">{s.price.toLocaleString()} ₫</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Color selection */}
                            <div className="option-group">
                                <p className="option-title">{t("product_detail.select_color")}</p>
                                <div className="option-list">
                                    {colorOptions.map((c) => (
                                        <div
                                            key={c.name}
                                            className={`option-item ${selectedColor === c.name ? "selected" : ""}`}
                                            onClick={() => {
                                                setSelectedColor(c.name);
                                                setSelectedImage(c.image);
                                            }}
                                        >
                                            <span>{c.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="product-description-main">
                                <p className="option-title">{t("product-description")}</p>
                                <div className="product-description">
                                    Xiaomi POCO M7 Pro 5G là chiếc điện thoại thuộc phân khúc giá rẻ nhưng mang đến trải nghiệm vượt trội trong tầm giá. Máy sở hữu thiết kế hiện đại, khung viền tinh tế và màn hình lớn 6.67 inch sử dụng tấm nền AMOLED cho màu sắc rực rỡ, hiển thị sắc nét. Bên trong là sức mạnh của chip Dimensity 920, kết hợp RAM 12GB và bộ nhớ trong lên đến 512GB, giúp xử lý mượt mà mọi tác vụ. Viên pin 5000mAh hỗ trợ sạc nhanh 18W, cho thời gian sử dụng dài lâu, đáp ứng tốt nhu cầu học tập, làm việc và giải trí mỗi ngày.
                                </div>
                            </div>

                            <div className="btn-group">
                                <button className="btn-buy">
                                    <FaBagShopping />
                                    <div>{t("product_detail.buy_now")}</div>
                                </button>
                                <button className="btn-credit">
                                    <FaCartShopping />
                                    <div>{t("product_detail.add_to_cart")}</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="comment-page">
                    <div className="comment-title">Bình luận về sản phẩm A</div>

                    <div className="comment-section">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t("comment.enter_username")}
                            style={{ width: "100%" }}
                        />
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("comment.enter_email")}
                            style={{ width: "100%" }}
                        />
                        <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder={t("comment.enter_phone_number")}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div className="comment-section">
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={t("comment.enter_comment")}
                        />
                    </div>

                    <div className="comment-section-action">
                        <button className="btn-submit-comment">
                            <FaPaperPlane />
                            <div>{t("comment.submit_comment")}</div>
                        </button>
                    </div>


                    <div className="comment-section-data">
                        <div className="comment-data-avatar">
                            <CommentAvatar avatarUrl={""} />
                        </div>
                        <div className="comment-data-content">
                            <div className="comment-username-date">
                                <span className="comment-username">Nguyen Van A</span>
                                <span className="comment-date">01/01/2024</span>
                            </div>
                            <div className="comment-text">
                                Đây là một sản phẩm tuyệt vời! Tôi rất hài lòng với hiệu suất và thiết kế của nó.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="image-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="image-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-btn prev" onClick={handlePrev}>
                            <FaChevronLeft />
                        </button>

                        <img src={selectedImage} alt="Large view" className="modal-image" />

                        <button className="modal-btn next" onClick={handleNext}>
                            <FaChevronRight />
                        </button>

                        <button className="modal-close" onClick={() => setShowModal(false)}>
                            <FaXmark />
                        </button>

                        <div className="modal-thumbnail-list">
                            {colorOptions.map((c, index) => (
                                <div
                                    key={c.name}
                                    className={`modal-thumbnail-item ${selectedColor === c.name ? "active" : ""}`}
                                    onClick={() => {
                                        setSelectedColor(c.name);
                                        setSelectedImage(c.image);
                                        setCurrentIndex(index);
                                    }}
                                >
                                    <img src={c.image} alt={c.name} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
