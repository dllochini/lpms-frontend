import axiosBackend from "../configs/axios-config";

// export const getTasks = () => axiosBackend.get("/task");

// export const createTask = (taskData) => axiosBackend.post("/task", taskData);

export const getAllTasks = async() => {
  const result = await axiosBackend.get("/tasks")
  return result.data;
};

export const getTasksByLandId = (landId) => axiosBackend.get(`/tasks/${landId}`);

// export const updateTaskById = (taskId, updatedData) =>
//   axiosBackend.put(`/task/${taskId}`, updatedData);

// export const deleteTaskById = (taskId) => {
//   return axiosBackend.delete(`/task/${taskId}`);
// };

export default {
  // getTasks,
  // createTask,
  getTasksByLandId,
  // updateTaskById,
  // deleteTaskById,
};
