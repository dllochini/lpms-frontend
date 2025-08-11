import axiosBackend from "../configs/axios-config";

export const getUsers = () => axiosBackend.get("/users");

export const createUser = (userData) => axiosBackend.post("/users", userData);

export const getUserById = (userId) => axiosBackend.get(`/users/${userId}`);

export const updateUserById = (userId, updatedData) =>
  axiosBackend.put(`/users/${userId}`, updatedData);

export const deleteUserById = (userId) => {
  return axiosBackend.delete(`/users/${userId}`);
};

export default {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
