
import axiosBackend from "../configs/axios-config";

export const sendResetLink = (email) =>
  axiosBackend.post("/forgot-password", { email });

export const resetPassword = (token, newPassword) =>
  axiosBackend.post("/reset-password", { token, password: newPassword });

