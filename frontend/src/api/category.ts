import api from "./index";

export const createOrUpdateCategory = (data: FormData) => {
  return api.post("/categories/admin/createOrUpdate", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const getCategoryById = (categoryId?: number | null | string) => {
  return api.get(`/categories/getCategoryById/${categoryId}`);
};