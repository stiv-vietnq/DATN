import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPaperclip, FaStar } from "react-icons/fa";
import {
  FaBagShopping,
  FaCartShopping,
  FaChevronLeft,
  FaChevronRight,
  FaPaperPlane,
  FaRegStar,
  FaXmark,
} from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { createOrUpdateCart } from "../../../api/cart";
import { createComment } from "../../../api/comment";
import { getDiscountedPrice, GetProductById } from "../../../api/product";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import Input from "../../../components/common/input/Input";
import Loading from "../../../components/common/loading/Loading";
import Textarea from "../../../components/common/textarea/Textarea";
import Banner from "./Banner";
import CommentAvatar from "./commentAvatar/CommentAvatar";
import "./productDetail.css";
import { useToast } from "../../../components/toastProvider/ToastProvider";

interface ProductDetailType {
  id: number;
  productId: string;
  name: string;
  quantity: number;
  quantitySold: number;
  price: number;
  directoryPath: string;
  description: string;
}

interface Product {
  id: string;
  productName: string;
  price: number;
  description: string | null;
  status: boolean;
  createdDate: string;
  updatedDate: string;
  quantitySold: number;
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState<number>(1);

  const handleFileChange = (e: { target: { files: any } }) => {
    setFiles([...e.target.files]);
  };

  useEffect(() => {
    if (id) {
      getById(String(id));
      handleGetDiscountedPrice(String(id));
    }
  }, [id]);

  const getById = (productId: string) => {
    setLoading(true);
    GetProductById(productId)
      .then((response) => {
        const data = response?.data;
        setProductData(data);
      })
      .catch(() => {
        showToast("Vui lòng liên hệ quản trị viên", "error");
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

  const handleGetDiscountedPrice = async (productId: string) => {
    try {
      const response = await getDiscountedPrice(productId);
      const data = response?.data;
      setDiscountedPrice(data);
    } catch (error) {
      showToast("Vui lòng liên hệ quản trị viên", "error");
    }
  };

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
      .catch(() => {
        showToast("Vui lòng liên hệ quản trị viên", "error");
      });
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleAddToCart = async () => {
    setLoading(true);
    if (!selectedDetail) {
      showToast("Vui lòng chọn chi tiết sản phẩm!", "info");
      setLoading(false);
      return;
    }

    if (quantity <= 0 || quantity > (selectedDetail?.quantity || 0)) {
      showToast("Vui lòng chọn số lượng hợp lệ!", "info");
      setLoading(false);
      return;
    }

    try {
      const userId = Number(localStorage.getItem("userId") || "0");

      const total =
        (selectedDetail?.price || 0) *
        (1 - (discountedPrice || 0) / 100) *
        quantity;

      const cartDto = {
        productDetailId: String(selectedDetail.id),
        userId,
        quantity,
        total,
        size: 0,
      };

      createOrUpdateCart(cartDto);
    } catch (error) {
      showToast("Vui lòng liên hệ quản trị viên", "error");
    } finally {
      setLoading(false);
      navigate("/cart");
    }
  };

  const handleBuyNow = () => {
    setLoading(true);
    if (!selectedDetail) {
      showToast("Vui lòng chọn chi tiết sản phẩm!", "info");
      setLoading(false);
      return;
    }

    if (quantity <= 0 || quantity > (selectedDetail?.quantity || 0)) {
      showToast("Vui lòng chọn số lượng hợp lệ!", "info");
      setLoading(false);
      return;
    }

    try {
      const userId = Number(localStorage.getItem("userId") || "0");

      const total =
        selectedDetail.price * (1 - (discountedPrice || 0) / 100) * quantity;

      const cartDto = {
        productDetailId: String(selectedDetail.id),
        userId,
        quantity,
        total,
        size: 0,
      };

      createOrUpdateCart(cartDto).then((res) => {
        navigate("/cart", { state: { autoSelectId: res.data.id } });
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num == null) return 0;

    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(".0", "") + "tr";
    }

    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(".0", "") + "k";
    }

    return num;
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) return <Loading />;

  return (
    <div className="main-content" style={{ paddingBottom: "40px" }}>
      <div style={{ width: "70%", margin: "120px auto 0 auto" }}>
        <div className="product-page">
          <Breadcrumb items={breadcrumbItems} />
          <Banner />

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
              <div className="product-detail-title">
                {productData?.productName}
              </div>
              {/* Giá */}
              <div className="product-price">
                {discountedPrice && discountedPrice > 0 ? (
                  <>
                    {/* Giá sau khi giảm */}
                    <span className="current">
                      {(
                        (selectedDetail?.price || 0) *
                        (1 - (discountedPrice || 0) / 100)
                      ).toLocaleString()}{" "}
                      ₫
                    </span>

                    {/* Giá gốc */}
                    <span className="old">
                      {(selectedDetail?.price || 0).toLocaleString()} ₫
                    </span>
                  </>
                ) : (
                  <span className="current">
                    {(
                      selectedDetail?.price ??
                      productData?.price ??
                      0
                    ).toLocaleString()}{" "}
                    ₫
                  </span>
                )}
              </div>

              <div className="option-info-group">
                <div
                  style={{
                    borderRight: "1px solid #ccc",
                    paddingRight: "15px",
                    marginRight: "15px",
                  }}
                >
                  {t("product_detail.remaining_quantity")}{" "}
                  {formatNumber(selectedDetail?.quantity ?? 0)}
                </div>

                <div
                  style={{
                    borderRight: "1px solid #ccc",
                    paddingRight: "15px",
                    marginRight: "15px",
                  }}
                >
                  {t("product_detail.sold_quantity")}{" "}
                  {formatNumber(selectedDetail?.quantitySold ?? 0)}
                </div>
                <div>
                  <div className="vote-number">
                    {productData?.evaluate
                      ? productData.evaluate.toFixed(1)
                      : "0"}
                    <FaStar
                      className="star small"
                      style={{ color: "#f8b400" }}
                    />
                  </div>
                </div>
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

              {/* Chọn số lượng */}
              <div className="quantity-group">
                <p className="option-title">
                  {t("product_detail.select_quantity")}
                </p>
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={decreaseQuantity}>
                    -
                  </button>
                  <input
                    type="number"
                    className="qty-input"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value) || 1))
                    }
                  />
                  <button className="qty-btn" onClick={increaseQuantity}>
                    +
                  </button>
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
                <button
                  className="btn-buy"
                  onClick={handleBuyNow}
                  disabled={
                    selectedDetail?.quantity === 0 ||
                    selectedDetail == null ||
                    quantity <= 0
                  }
                >
                  <FaBagShopping />
                  <div>{t("product_detail.buy_now")}</div>
                </button>
                <button
                  className="btn-credit"
                  onClick={handleAddToCart}
                  disabled={
                    selectedDetail?.quantity === 0 ||
                    selectedDetail == null ||
                    quantity <= 0
                  }
                >
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
