import axiosBackend from "../configs/axios-config";

export const createBill = async (processId) => {
  const res = await axiosBackend.post("/bill/create", processId);
  return res;
};

export const getBillsByDiv = async (userId) => { 
  const result = await axiosBackend.get(`/bill/${userId}`);
  console.log(result.data, "api");
  return result.data?.data || []; // <-- extract the array from `data`
};

export const getBillByProcess = async (processId) => { 
  const result = await axiosBackend.get(`/bill/process/${processId}`);
  console.log(result.data, "api");
  return result.data?.data || []; // <-- extract the array from `data`
};

export const updateBillById = async (billId, updatedData) => {
  console.log(billId, updatedData, "api update bill");
  if (!billId) throw new Error("billId required");
  const res = await axiosBackend.put(`/bill/${billId}`, updatedData);
  return res.data; // return server payload
};

