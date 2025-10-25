import axiosBackend from "../configs/axios-config";

// export const getTasks = () => axiosBackend.get("/task");

export const createTask = (taskData) => axiosBackend.post("/tasks", taskData);

export const getAllTasks = async() => {
  const result = await axiosBackend.get("/tasks")
  return result.data;
};

export const getTasksByLandId = (landId) => axiosBackend.get(`/tasks/${landId}`);

export const getTasksByDiv = async (userId) => {
  console.log("id",userId)
  const res = await axiosBackend.get(`/tasks/manager/${userId}`)
  return res.data;
};

export const updateTaskById = async (taskId, updatedData) => {
  if (!taskId) throw new Error("taskId required");
  const res = await axiosBackend.put(`/tasks/${taskId}`, updatedData);
  return res.data; // return server payload
};

// export const updateStatusByTask = (taskId, updatedData) => axiosBackend.put(`/tasks/status/${taskId}`, updatedData);

export const deleteTaskById = (taskId) => {
  console.log(taskId, "input");
  return axiosBackend.delete(`/tasks/${taskId}`);
};

export default {
  // getTasks,
  createTask,
  getTasksByLandId,
  updateTaskById,
  deleteTaskById,
};
