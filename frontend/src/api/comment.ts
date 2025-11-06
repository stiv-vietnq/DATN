import api from "./index";

export const createComment = (data: FormData) => {
  return api.post(`/comments/createComment`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
