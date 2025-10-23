import axiosBackend from "../configs/axios-config";

export const getProcessByLandId = async (landId) => {
  if (!landId) console.log("error happened");
  const result = await axiosBackend.get(`/process/${landId}`);
  // console.log(result.data,"in api");
  return result.data;
};
