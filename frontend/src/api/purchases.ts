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
