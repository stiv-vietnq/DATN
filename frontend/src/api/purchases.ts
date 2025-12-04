import api from "./index";

export interface PurchaseItemDto {
  addressId: number | null;
  productId: string;
  productDetailId: number | null;
  quantity: number;
  total: string;
  totalAfterDiscount: string;
}

export interface PurchaseDto {
  addressId: number;
  userId: number;
  description: string;
  discountId?: number | null;
  paymentMethod: string;
  items: PurchaseItemDto[];
}

export const createPurchase = (purchases: PurchaseDto[]) => {
  return api.post("/purchases/createPurchase", purchases);
};

export const getPurchaseByUserId = (
  userId: number,
  productName: string = "",
  status: string = ""
) => {
  return api.get(`/purchases/getPurchaseByUserId/${userId}`, {
    params: {
      productName,
      status,
    },
  });
};

export const updateStatus = (id: number, status: number, cancellationReason: string, cancelledByAdmin: boolean) => {
  return api.post(`/purchases/updateStatus/${id}`, null, {
    params: { status, cancellationReason, cancelledByAdmin },
  });
};

export const getAllPurchase = (
  userId: number,
  paymentMethod: string,
  status: number
) => {
  return api.get(`/purchases/admin/getAllPurchase/`, {
    params: { userId, paymentMethod, status },
  });
};

export const getPurchaseById = (id: number) => {
  return api.get(`/purchases/admin/getById/${id}`);
};
