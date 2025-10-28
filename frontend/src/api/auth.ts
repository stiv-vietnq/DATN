import api from "./index";

export const login = (data: { usernameOrEmail: string; password: string }) =>
  api.post("/sign-in", data);

export const register = (data: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  repeatPassword: string;
}) =>
  api.post("/sign-up", data);

export const verify = (data: { token: string }) =>
  api.post("/verify-code", data);