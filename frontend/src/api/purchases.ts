import api from "./index";

export interface PurchaseItemDto {
  productId: string;
  productDetailId: number;
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

