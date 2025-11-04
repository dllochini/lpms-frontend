import axiosBackend from "../configs/axios-config";

export const getUnits = () => axiosBackend.get("/unit");
  // console.log("Fetching units from /unit endpoint");

export const createUnit = (unitData) => axiosBackend.post("/unit", unitData);

export default {
  getUnits,
  createUnit,
};
