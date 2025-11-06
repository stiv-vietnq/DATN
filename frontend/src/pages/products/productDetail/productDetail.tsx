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
  FaRegStar,
  FaXmark,
} from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Textarea from "../../../components/common/textarea/Textarea";
import Input from "../../../components/common/input/Input";
import CommentAvatar from "./commentAvatar/CommentAvatar";
import { GetProductById } from "../../../api/product";
import { useParams } from "react-router-dom";
import { FaPaperclip, FaStar } from "react-icons/fa";
import { createComment } from "../../../api/comment";
import Loading from "../../../components/common/loading/Loading";

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
  comments?: CommentType[];
  evaluate?: number;
}

interface CommentType {
  id: number;
  fullName: string;
  description: string;
  evaluate: number;
  createdDate: string;
  images?: { id: number; commentId: number; directoryPath: string }[];
}

export default function ProductDetail() {
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [productData, setProductData] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] =
    useState<ProductDetailType | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Comment
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [files, setFiles] = useState<File[]>([]);

  // 🔹 Hàm chọn file
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  useEffect(() => {
    if (id) {
      getById(String(id));
    }
  }, [id]);

  const getById = (productId: string) => {
    setLoading(true);
    GetProductById(productId)
      .then((response) => {
        const data = response?.data;
        setProductData(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  const handleSubmitComment = () => {
    const formData = new FormData();
    formData.append("productId", id || "");
    formData.append("fullName", name);
    formData.append("username", localStorage.getItem("username") || "");
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("description", comment);
    formData.append("evaluate", rating.toString());

    files.forEach((file) => {
      formData.append("files", file);
    });

    console.log(formData);

    createComment(formData)
      .then(() => {
        setName("");
        setEmail("");
        setPhoneNumber("");
        setComment("");
        setRating(0);
        setFiles([]);
        getById(String(id));
      })
      .catch((error) => {
        console.error("Lỗi khi gửi bình luận:", error);
      });
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  if (loading) return <Loading />;

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
                {selectedDetail?.percentageReduction &&
                selectedDetail.percentageReduction > 0 ? (
                  <>
                    {/* Giá sau khi giảm */}
                    <span className="current">
                      {(
                        selectedDetail.price *
                        (1 - selectedDetail.percentageReduction / 100)
                      ).toLocaleString()}{" "}
                      ₫
                    </span>

                    {/* Giá gốc */}
                    <span className="old">
                      {selectedDetail.price.toLocaleString()} ₫
                    </span>
                  </>
                ) : (
                  // Không có giảm giá → chỉ hiển thị giá thường
                  <span className="current">
                    {selectedDetail
                      ? selectedDetail.price.toLocaleString()
                      : productData?.price.toLocaleString()}{" "}
                    ₫
                  </span>
                )}
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

              <div className="product-description-main">
                <div className="option-title">{t("comment.rating")}: </div>
                <div className="vote-number">
                  {productData?.evaluate || 0}
                  <FaRegStar
                    className="star small"
                    style={{ color: "#f8b400" }}
                  />
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
          <div className="comment-vote-upload">
            <div className="comment-section rating-section">
              <span className="rating-label">{t("comment.your_rating")}</span>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= rating ? (
                    <FaStar
                      key={star}
                      className="star active"
                      onClick={() => setRating(star)}
                    />
                  ) : (
                    <FaRegStar
                      key={star}
                      className="star"
                      onClick={() => setRating(star)}
                    />
                  )
                )}
              </div>
            </div>

            <div className="file-upload">
              <label htmlFor="fileInput" className="upload-label">
                <FaPaperclip /> Chọn tệp đính kèm
              </label>
              <input
                id="fileInput"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div className="file-list">
                {files?.map((file, index) => (
                  <div key={index} className="file-item">
                    <span className="file-name" title={file.name}>
                      {file.name.length > 15
                        ? file.name.substring(0, 15) + "..."
                        : file.name}
                    </span>
                    <button
                      className="file-remove-btn"
                      onClick={() => handleRemoveFile(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="comment-section-action">
            <button
              className="btn-submit-comment"
              onClick={handleSubmitComment}
            >
              <FaPaperPlane />
              <div>{t("comment.submit_comment")}</div>
            </button>
          </div>

          {productData?.comments?.map((comment) => (
            <div className="comment-section-data">
              <div className="comment-data-avatar">
                <CommentAvatar avatarUrl={""} />
              </div>
              <div key={comment.id} className="comment-data-content">
                {/* --- Tên và ngày --- */}
                <div className="comment-username-date">
                  <span className="comment-username">{comment.fullName}</span>
                  <span className="comment-date">
                    {new Date(comment.createdDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="comment-rating-display-section">
                  <div className="comment-content">Đánh giá: </div>
                  <div className="comment-rating-display">
                    {[1, 2, 3, 4, 5].map((star) =>
                      star <= comment.evaluate ? (
                        <FaStar key={star} className="star small filled" />
                      ) : (
                        <FaRegStar key={star} className="star small" />
                      )
                    )}
                  </div>
                </div>

                {/* --- Nội dung bình luận --- */}
                <div className="comment-content">
                  <div style={{ width: "50%" }}>
                    <div className="comment-text-label">
                      Nội dung bình luận:
                    </div>
                    <textarea
                      className="comment-textarea"
                      value={comment.description}
                      readOnly
                    />
                  </div>
                  {/* --- Ảnh đính kèm --- */}
                  <div style={{ width: "50%" }}>
                    {comment.images && comment.images.length > 0 && (
                      <div className="comment-images">
                        {comment.images.map((img, index) => (
                          <img
                            key={index}
                            src={img.directoryPath}
                            alt={`comment-${comment.id}-${index}`}
                            className="comment-image"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
