import api from "./index";

export const getBrandById = (brandId?: number | null | string) => {
  return api.get(`/productTypes/getProductType/${brandId}`);
};

export const createOrUpdateBrand = (data: FormData) => {
  return api.post("/productTypes/admin/createOrUpdateProductType", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteBrand = (brandId: number) =>
  api.post(`/productTypes/admin/deleteProductType/${brandId}`);

export const updateStatus = (id: number, status: boolean) => {
  const formData = new FormData();
  formData.append("id", id.toString());
  formData.append("status", String(status));
  return api.post("/productTypes/admin/updateStatus", formData);
};

export const searchProductType = (params: {
  name?: string;
  status?: string | null;
}) => {
  return api.get("/productTypes/search", { params });
};

export const getProductTypeByStatus = (params: {
  status?: string | null;
}) => {
  return api.get("/productTypes/getAllProductTypesByStatus", { params });
};

export const getProductTypeById = (id: number) => {
  return api.get(`/productTypes/getProductsByProductTypeId/${id}`);
}
