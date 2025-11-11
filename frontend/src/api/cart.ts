import api from "./index";

export const getAllCartsByUserId = (userId: number, name: string, status: boolean) => {
  return api.get(`/carts/getAllCartsByUserId/${userId}`, {
    params: { name, status }
  });
};
