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
