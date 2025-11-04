import axiosBackend from "../configs/axios-config";

export const getRoles = () => axiosBackend.get("/roles");

export default {
  getRoles,
};
