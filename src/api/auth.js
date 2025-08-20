import axiosBackend from "../configs/axios-config";

export const loginUser = (data) => {
//   console.log("response:", data);
  return axiosBackend.post("/auth/login", data);
};

export const forgotPassword = (data) => {
  return axiosBackend.post("/auth/forgot-password", data);
};

export const resetPassword = (token, password) => {
//   console.log("response:", password);
  return axiosBackend.post("/auth/reset-password", { token, password });
};