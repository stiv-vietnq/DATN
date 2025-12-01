import api from "./index";

export const createMomoPaymentMomo = (amount: string) => {
    return api.post(`/payments/submitOrderMomo?amount=${amount}`);
};

export const submitOrderVnPay = (orderInfo: string, amount: string) => {
    return api.post(`/payments/submitOrderVnPay?amount=${amount}&orderInfo=${orderInfo}`);
};

export const createPayment = (
  method: string,
  amount: string,
  currency: string,
  description: string
) => {
  const url = `/payments/create?method=${method}&amount=${amount}&currency=${currency}&description=${description}`;
  return api.post(url);
};

