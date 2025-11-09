import api from "./index";

export const searchUsers = (params: any) => {
  return api.get(`/admin/getAll`, { params });
};

export const lockAccount = (
  usernameOrEmail: string,
  params: { isLocked: string }
) => {
  return api.post(`/admin/lock-account/${usernameOrEmail}`, params);
};

export const getUserProfile = (id: number) => {
  return api.get(`/account/${id}`);
};

export const updateUserProfile = (data: {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: number;
  phoneNumber: string;
  file?: File | null;
}) => {
  const formData = new FormData();
  formData.append("id", String(data.id));
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("dateOfBirth", data.dateOfBirth);
  formData.append("sex", String(data.sex));
  formData.append("phoneNumber", data.phoneNumber);
  if (data.file) {
    formData.append("file", data.file);
  }

  return api.post("/account/update-account", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const changePassword = (data: {
  usernameOrEmail: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return api.post("/account/change-password", data);
};
