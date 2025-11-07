import api from "./index";

export const searchUsers = (params: any) => {
    return api.get(`/admin/getAll`, { params });
};

export const lockAccount = (usernameOrEmail: string, params: { isLocked: string }) => {
    return api.post(`/admin/lock-account/${usernameOrEmail}`, params);
};

