import { useEffect, useState } from "react";
import Banner from "./Banner";
import "./productDetail.css";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import {
  FaBagShopping,
  FaCartShopping,
  FaChevronLeft,
  FaChevronRight,
  FaPaperPlane,
  FaXmark,
} from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Textarea from "../../../components/common/textarea/Textarea";
import Input from "../../../components/common/input/Input";
import CommentAvatar from "./commentAvatar/CommentAvatar";
import { GetProductById } from "../../../api/product";
import { useParams } from "react-router-dom";

interface ProductDetailType {
  id: number;
  productId: number;
  name: string;
  quantity: number;
  price: number;
  percentageReduction: number;
  directoryPath: string;
  description: string;
}

interface Product {
  id: number;
  productName: string;
  price: number;
  description: string | null;
  status: boolean;
  createdDate: string;
  updatedDate: string;
  quantitySold: number;
  percentageReduction: number;
  numberOfVisits: number;
  productType?: { id: number; name: string; directoryPath?: string };
  categoryId?: string;
  images?: { id: number; productId: number; directoryPath: string }[];
  productDetails?: ProductDetailType[];
  comments?: { id: number; name: string; content: string; date: string }[];
}

export default function ProductDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [productData, setProductData] = useState<Product | null>(null);

  // ✅ Tách riêng state cho ảnh và chi tiết
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] =
    useState<ProductDetailType | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Comment
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    if (id) {
      getById(Number(id));
    }
  }, [id]);

  const getById = (productId: number) => {
    GetProductById(productId)
      .then((response) => {
        const data = response?.data;
        setProductData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // ✅ Khi productData thay đổi -> chọn mặc định
  useEffect(() => {
    if (productData) {
      if (productData.productDetails && productData.productDetails.length > 0) {
        setSelectedDetail(productData.productDetails[0]);
      }

      if (productData.images && productData.images.length > 0) {
        setSelectedImage(productData.images[0].directoryPath);
        setSelectedImageId(productData.images[0].id);
      }
    }
  }, [productData]);

  const handleNext = () => {
    if (!productData?.images) return;
    const nextIndex = (currentIndex + 1) % productData.images.length;
    const nextImg = productData.images[nextIndex];
    setSelectedImage(nextImg.directoryPath);
    setSelectedImageId(nextImg.id);
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
    if (!productData?.images) return;
    const prevIndex =
      (currentIndex - 1 + productData.images.length) %
      productData.images.length;
    const prevImg = productData.images[prevIndex];
    setSelectedImage(prevImg.directoryPath);
    setSelectedImageId(prevImg.id);
    setCurrentIndex(prevIndex);
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sản phẩm", path: "/products" },
    { label: productData?.productName || "" },
  ];

  return (
    <div className="main-content" style={{ paddingBottom: "40px" }}>
      <div style={{ width: "70%", margin: "120px auto 0 auto" }}>
        <div className="product-page">
          <Breadcrumb items={breadcrumbItems} />
          <Banner />

          <div className="product-detail-title">{productData?.productName}</div>

          <div className="product-detail">
            {/* LEFT IMAGE */}
            <div className="product-left">
              <img
                src={
                  selectedImage ||
                  "https://via.placeholder.com/400x400?text=No+Image"
                }
                alt={productData?.productName}
                className="product-main-img"
                onClick={() => setShowModal(true)}
              />

              {/* Danh sách ảnh */}
              <div className="thumbnail-list">
                {productData?.images?.map((img, index) => (
                  <div
                    key={img.id}
                    className={`thumbnail-item ${
                      selectedImageId === img.id ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedImage(img.directoryPath);
                      setSelectedImageId(img.id);
                      setCurrentIndex(index);
                    }}
                  >
                    <img src={img.directoryPath} alt={`image-${img.id}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT INFO */}
            <div className="product-right">
              {/* Giá */}
              <div className="product-price">
                {selectedDetail?.percentageReduction && (
                  <span className="current">
                    {(
                      selectedDetail.price /
                      (1 + selectedDetail.percentageReduction / 100)
                    ).toLocaleString()}{" "}
                    ₫
                  </span>
                )}
                <span className="old">
                  {selectedDetail
                    ? selectedDetail.price.toLocaleString()
                    : productData?.price.toLocaleString()}{" "}
                  ₫
                </span>
              </div>

              {/* Chọn chi tiết sản phẩm */}
              <div className="option-group">
                <p className="option-title">
                  {t("product_detail.select_color")}
                </p>
                <div className="option-list">
                  {productData?.productDetails?.map((d) => (
                    <div
                      key={d.id}
                      className={`option-item ${
                        selectedDetail?.id === d.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedDetail(d)}
                    >
                      <span>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mô tả */}
              <div className="product-description-main">
                <p className="option-title">{t("product-description")}</p>
                <div className="product-description">
                  {selectedDetail?.description || productData?.description}
                </div>
              </div>

              {/* Nút mua hàng */}
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

        {/* Comment Section */}
        <div className="comment-page">
          <div className="comment-title">
            Bình luận về sản phẩm {productData?.productName}
          </div>

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

          {/* Bình luận mẫu */}
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
                Sản phẩm rất tuyệt vời! Màu đẹp, hiệu năng tốt.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL IMAGE VIEWER */}
      {showModal && (
        <div
          className="image-modal-overlay"
          onClick={() => setShowModal(false)}
        >
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
              {productData?.images?.map((img, index) => (
                <div
                  key={img.id}
                  className={`modal-thumbnail-item ${
                    selectedImageId === img.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedImage(img.directoryPath);
                    setSelectedImageId(img.id);
                    setCurrentIndex(index);
                  }}
                >
                  <img src={img.directoryPath} alt={String(img.id)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
