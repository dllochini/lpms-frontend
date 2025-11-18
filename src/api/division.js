import axiosBackend from "../configs/axios-config";

export const getDivisions = () => axiosBackend.get("/divisions");

export default {
  getDivisions,
};
