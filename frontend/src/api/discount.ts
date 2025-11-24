import api from "./index";

export const searchDiscount = (params: {
  name?: string;
  status?: boolean | null;
}) => {
  return api.get("/discounts/admin/search", { params });
};

export const createOrUpdate = (data: FormData) => {
  return api.post("/discounts/admin/createOrUpdate", data);
};
