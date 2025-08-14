import axiosBackend from "../configs/axios-config"; // your configured axios instance

export const loginUser = (data) => axiosBackend.post("auth/login", data);

export const forgotPassword = (data) => axiosBackend.post("/auth/reset-password", data);
 