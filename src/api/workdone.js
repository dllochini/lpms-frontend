import axiosBackend from "../configs/axios-config";

export const getWorkDoneByTaskId = () => axiosBackend.get("/workDone");

export const getAllWorkDone = async () => {
  const result = await axiosBackend.get("/workDone");
  return result.data;
};

export const createWorkDone = (workDoneData) => axiosBackend.post("/workdone", workDoneData);

export default {
  getWorkDoneByTaskId,
  getAllWorkDone,
  createWorkDone,
};
