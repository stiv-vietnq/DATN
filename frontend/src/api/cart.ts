import api from "./index";

export const getAllCartsByUserId = (userId: number, name: string, status: boolean) => {
  return api.get(`/carts/getAllCartsByUserId/${userId}`, {
    params: { name, status }
  });
};

export const createOrUpdateCart = (cartDto: {
  id?: number;
  productDetailId: string;
  userId: number;
  quantity: number;
  total: number;
  size: number;
}) => {
  return api.post("/carts/createOrUpdateCart", cartDto);
};

