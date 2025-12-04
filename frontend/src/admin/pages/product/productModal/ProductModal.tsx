import React, { useEffect, useState } from "react";
import { FaPlus, FaX } from "react-icons/fa6";
import Dropdown from "../../../../components/common/dropdown/Dropdown";
import StringDropdownPropThree from "../../../../components/common/dropdown/StringDropdownPropThree";
import Input from "../../../../components/common/input/Input";
import Loading from "../../../../components/common/loading/Loading";
import MultiImageUpload from "../../../../components/common/multiImageUpload/MultiImageUpload";
import Textarea from "../../../../components/common/textarea/Textarea";
import ProductDetailItem, {
  ProductDetail,
} from "./productDetailItem/ProductDetailItem";
import "./ProductModal.css";
import { GetProductById, ProductCreateOrUpdate } from "../../../../api/product";
import { getCategorysByProductTypeId } from "../../../../api/category";
import { getProductTypeByStatus } from "../../../../api/brand";
import { useToast } from "../../../../components/toastProvider/ToastProvider";
import { sendNotification } from "../../../../api/notification";
import { UserTable } from "../../user/UserPage";
import { searchUsers } from "../../../../api/user";

interface ProductModalProps {
  productId?: number | null | string;
  onClose: (shouldReload?: boolean) => void;
  mode: "add" | "edit" | "view";
}

interface Option {
  id: string;
  name: string;
  code: string;
}

interface ExistingImage {
  id: number;
  url: string;
}

const ProductModal: React.FC<ProductModalProps> = ({
  productId,
  onClose,
  mode,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [price, setPrice] = useState<string>("");
  const [imageIdsToRemove, setImageIdsToRemove] = useState<number[]>([]);
  const [listProductDetailIdRemove, setListProductDetailIdRemove] = useState<
    number[]
  >([]);
  const [files, setFiles] = useState<File[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [brandOptions, setBrandOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Option | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [initialImages, setInitialImages] = useState<ExistingImage[]>([]);
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserTable[]>([]);

  useEffect(() => {
    getAllBrands();
    if ((mode === "edit" || mode === "view") && productId) {
      GetProductById(String(productId))
        .then((response) => {
          const data = response?.data;
          setName(data?.productName || "");
          setDescription(data?.description || "");
          setSelectedStatus(data?.status || false);
          if (data?.productType) {
            setSelectedBrand({
              id: String(data.productType.id),
              name: data.productType.name,
              code: data.productType.code,
            });
            fetchCategoriesByProductTypeId(String(data.productType.id));
          }

          if (data?.categoryId) {
            const id = String(data.categoryId);

            const foundCategory = categoryOptions.find((c) => c.id === id);

            if (foundCategory) {
              setSelectedCategory(foundCategory);
            } else {
              setSelectedCategory({
                id: id,
                name: "",
                code: "",
              });
            }
          }

          if (data?.price) {
            setPrice(String(data.price));
          }

          setProductDetails(data?.productDetails || []);

          // Images
          const images: ExistingImage[] =
            data?.images?.map((item: any) => ({
              id: item.id,
              url: item.directoryPath,
            })) || [];
          setInitialImages(images);
        })
        .catch(() => {
          showToast("Lỗi khi lấy sản phẩm!", "error");
        });
    }
  }, [productId, mode]);

  const handleSearch = () => {
    setLoading(true);
    const params = {
      username: "",
      fromDate: "",
      toDate: "",
      isActive: "",
      isLocked: "",
    };
    searchUsers(params)
      .then((response) => {
        setUsers(response.data);
      })
      .catch(() => {
        showToast("Lỗi lấy dữ liệu người dùng", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const getAllBrands = () => {
    setLoading(true);
    getProductTypeByStatus({ status: null })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: Option[] = data.map((item: any) => ({
          id: String(item.id),
          name: item.name,
          code: item.code,
        }));
        setBrandOptions(mappedOptions);
      })
      .catch(() => {
        showToast("Lỗi khi lấy thương hiệu!", "error");
      })
      .finally(() => setLoading(false));
  };

  const fetchCategoriesByProductTypeId = (value: string | null) => {
    if (!value) return;
    getCategorysByProductTypeId({
      productTypeId: value,
      status: null,
    })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: Option[] = data.map((item: any) => ({
          id: String(item.id),
          name: item.name,
          code: item.code,
        }));
        setCategoryOptions(mappedOptions);
      })
      .catch(() => {
        showToast("Lỗi khi lấy loại sản phẩm!", "info");
      });
  };

  const handleSubmit = async () => {
    if (!name) {
      showToast("Vui lòng nhập tên sản phẩm!", "info");
      return;
    }

    if (!selectedBrand) {
      showToast("Vui lòng chọn thương hiệu sản phẩm!", "info");
      return;
    }

    if (!selectedCategory) {
      showToast("Vui lòng chọn loại sản phẩm!", "info");
      return;
    }

    if (!selectedStatus) {
      showToast("Vui lòng chọn trạng thái hoạt động!", "info");
      return;
    }

    if (!price) {
      showToast("Vui lòng nhập giá sản phẩm!", "info");
      return;
    }

    if (productDetails.length === 0) {
      showToast("Vui lòng thêm sản phẩm chi tiết!", "info");
      return;
    }

    if (
      productDetails.some(
        (detail) =>
          !detail.name ||
          detail.quantity <= 0 ||
          !detail.price ||
          !detail.directoryPath
      )
    ) {
      showToast(
        "Vui lòng điền đầy đủ thông tin cho tất cả sản phẩm chi tiết!",
        "info"
      );
      return;
    }

    if (files.length === 0 && initialImages.length === 0) {
      showToast("Vui lòng thêm ảnh sản phẩm!", "info");
      return;
    }

    const formData = new FormData();

    if (mode === "edit" && productId) {
      formData.append("id", productId.toString());
    }

    formData.append("productName", name);
    formData.append("description", description);

    formData.append("productTypeId", selectedBrand.id.toString());
    formData.append("brandCode", selectedBrand.code);

    formData.append("categoryId", selectedCategory.id.toString());
    formData.append("status", selectedStatus.toString());
    formData.append("price", price.toString());

    files.forEach((file) => {
      formData.append("images", file);
    });

    formData.append(
      "imageIdsToRemove",
      imageIdsToRemove.length > 0 ? imageIdsToRemove.join(",") : ""
    );

    formData.append(
      "listProductDetailIdRemove",
      listProductDetailIdRemove.length > 0
        ? listProductDetailIdRemove.join(",")
        : ""
    );

    productDetails.forEach((detail, index) => {
      formData.append(
        `productDetailDTOS[${index}].id`,
        detail.id?.toString() || ""
      );
      formData.append(`productDetailDTOS[${index}].name`, detail.name);
      formData.append(
        `productDetailDTOS[${index}].quantity`,
        detail.quantity.toString()
      );
      formData.append(
        `productDetailDTOS[${index}].price`,
        detail.price.toString()
      );
      formData.append(
        `productDetailDTOS[${index}].description`,
        detail.description
      );

      if (detail.imageFile instanceof File) {
        formData.append(
          `productDetailDTOS[${index}].imageFile`,
          detail.imageFile
        );
      }
      else if (detail.directoryPath) {
        formData.append(
          `productDetailDTOS[${index}].imageFilePath`,
          detail.directoryPath
        );
      }
    });

    ProductCreateOrUpdate(formData)
      .then(() => {
        showToast(
          `Sản phẩm đã được ${mode === "add" ? "thêm mới" : "cập nhật"
          } thành công!`,
          "success"
        );

        if (mode === "add") {
          if (users.length === 0) {
            showToast("Không có người dùng nào để gửi thông báo giảm giá!", "info");
            onClose(true);
            return;
          } else {
            const message = `Có sản phẩm mới được thêm: ${name}. Hãy truy cập ngay để khám phá!`;
            users.forEach((user) => {
              sendNotification({
                userId: user.id,
                type: "DISCOUNT",
                title: "Thông báo giảm giá sản phẩm",
                message: message,
                failReason: ""
              }).then().catch();
            });
          }
        }
        onClose(true);
      })
      .catch(() => {
        showToast(
          `Lỗi khi ${mode === "add" ? "thêm mới" : "cập nhật"} sản phẩm!`,
          "error"
        );
      });
  };

  const handleAddProductDetail = () => {
    setProductDetails((prev) => [
      ...prev,
      {
        id: undefined,
        name: "",
        quantity: 0,
        price: "",
        percentageReduction: "",
        description: "",
        type: null,
        directoryPath: null,
      },
    ]);
  };

  const handleRemoveProductDetail = (index: number) => {
    const removed = productDetails[index];
    if (removed.id !== undefined) {
      setListProductDetailIdRemove((prev) => [...prev, removed.id as number]);
    }
    setProductDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDetailChange = (
    index: number,
    field: keyof ProductDetail,
    value: any
  ) => {
    setProductDetails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            {mode === "add" && "Thêm sản phẩm"}
            {mode === "edit" && "Chỉnh sửa sản phẩm"}
            {mode === "view" && "Xem sản phẩm"}
          </div>
          <div className="button-close">
            <button onClick={() => onClose(false)}>
              <FaX />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* --- Thông tin chung --- */}
          <div className="modals-field">
            <div className="modal-field">
              <div className="modal-label-name">Tên sản phẩm:</div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên sản phẩm..."
                style={{ width: "100%" }}
                disabled={mode === "view"}
              />
            </div>
            <div className="modal-field">
              <div className="modal-label-name">Thương hiệu sản phẩm:</div>
              <StringDropdownPropThree
                value={selectedBrand}
                onChange={(option) => {
                  setSelectedBrand(option);
                  if (option?.id) {
                    fetchCategoriesByProductTypeId(option.id);
                  } else {
                    setSelectedCategory(null);
                    setCategoryOptions([]);
                  }
                }}
                options={brandOptions}
                placeholder="--Chọn thương hiệu--"
              />
            </div>
          </div>

          <div className="modals-field">
            <div className="modal-field" style={{ marginBottom: "-20px" }}>
              <div className="modal-label-name">Danh mục sản phẩm:</div>
              <StringDropdownPropThree
                value={selectedCategory}
                onChange={(option) => setSelectedCategory(option)}
                options={categoryOptions}
                placeholder="--Chọn danh mục--"
              />
            </div>

            <div className="modal-field">
              <div className="modal-label-name">Trạng thái:</div>
              <Dropdown
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { label: "Đang hoạt động", value: true },
                  { label: "Không hoạt động", value: false },
                ]}
                placeholder="--Chọn trạng thái--"
                disabled={mode === "view"}
              />
            </div>
          </div>

          {/* --- Giá & Giảm giá --- */}
          <div className="modals-field">
            <div className="modal-field">
              <div className="modal-label-name">Đơn giá:</div>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Nhập đơn giá sản phẩm..."
                style={{ width: "100%" }}
                disabled={mode === "view"}
                type="number"
              />
            </div>
          </div>

          {/* --- Sản phẩm chi tiết --- */}
          <div className="modal-field">
            <div className="modal-field-product-detail">
              <div className="modal-label-product-detail">
                Sản phẩm chi tiết
              </div>
              {mode !== "view" && (
                <div
                  className="modal-label-product-detail-icon"
                  onClick={handleAddProductDetail}
                  style={{ cursor: "pointer" }}
                >
                  <FaPlus />
                </div>
              )}
            </div>

            {productDetails.map((detail, index) => (
              <ProductDetailItem
                key={index}
                index={index}
                detail={detail}
                onChange={handleDetailChange}
                onRemove={handleRemoveProductDetail}
                disabled={mode === "view"}
              />
            ))}
          </div>

          {/* --- Mô tả --- */}
          <div className="modals-field" style={{ marginBottom: "8px" }}>
            <div className="modal-field">
              <div className="modal-label-name">Mô tả sản phẩm:</div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả sản phẩm..."
                disabled={mode === "view"}
              />
            </div>
          </div>

          {/* --- Ảnh sản phẩm --- */}
          <div className="modals-field" style={{ marginBottom: "8px" }}>
            <div className="modal-field">
              <div className="modal-label-name">Ảnh sản phẩm:</div>
              <MultiImageUpload
                initialImages={initialImages}
                onChange={(newFiles) => setFiles(newFiles)}
                onDelete={(deleted) => setImageIdsToRemove(deleted)}
                disabled={mode === "view"}
              />
            </div>
          </div>
        </div>

        {/* --- Nút hành động --- */}
        <div className="modal-actions">
          {mode !== "view" && (
            <button className="btn-green" onClick={handleSubmit}>
              {mode === "add" ? "Thêm mới" : "Lưu"}
            </button>
          )}
          <button onClick={() => onClose(false)} className="btn-secondary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
