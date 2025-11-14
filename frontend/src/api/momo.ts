import api from "./index";

export const createMomoPayment = (amount: string) => {
    return api.post(`/momo/submitOrder?amount=${amount}`);
};
