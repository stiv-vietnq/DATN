import api from "./index";

export const searchDiscount = (params: {
  name?: string;
  status?: boolean | null;
}) => {
  return api.get("/discounts/admin/search", { params });
};
export interface DiscountRequest {
  id: number | null;
  name: string;
  discountPercent: number;
  expiredDate: string | null;
  status: boolean | null;
  productIds: string[];
}

export const createOrUpdate = (data: DiscountRequest) => {
  return api.post("/discounts/admin/createOrUpdate", data);
};

export const getDiscountById = (discountId?: number | null ) => {
  return api.get(`/discounts/admin/getById/${discountId}`);
}

export const deleteDiscountById = (discountId: number) => {
  return api.post(`/discounts/admin/delete/${discountId}`);
};

export const updateDiscountStatus = (discountId: number, status: boolean) => {
  return api.post(`/discounts/admin/updateStatus/${discountId}`, null, {
    params: { status },
  });
};

