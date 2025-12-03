import api from "./index";

export const createOrUpdateCategory = (data: FormData) => {
  return api.post("/categories/admin/createOrUpdate", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const getCategoryById = (categoryId?: number | null | string) => {
  return api.get(`/categories/getCategoryById/${categoryId}`);
};

export const searchCategory = (params: {
  productTypeId?: string | null;
  name?: string;
  status?: string | null;
}) => {
  return api.get("/categories/getAllCategory", { params });
};

export const getCategorysByProductTypeId = (params: {
  productTypeId?: string | null;
  status?: string | null;
}) => {
  return api.get(`/categories/getCategorysByProductTypeId`, { params });
};

export const deleteCategory = (categoryId: number) => {
  return api.post(`/categories/admin/delete/${categoryId}`);
};
