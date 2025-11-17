import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTaskById,
  getAllTasks,
  getTasksByDiv,
  updateTaskById,
} from "../api/task.js";

// -------------------------------------------------------------
// GET ALL TASKS
// -------------------------------------------------------------
export const useGetAllTasks = (options = {}) => {
  return useQuery({
    queryKey: ["task"],
    queryFn: getAllTasks,
    ...options,
  });
};

// -------------------------------------------------------------
// GET TASKS BY FIELD OFFICER DIVISION
// -------------------------------------------------------------
export const useGetTasksByDiv = (userId, options = {}) =>
  useQuery({
    queryKey: ["fieldOfficerLands", userId],
    queryFn: () => getTasksByDiv(userId),
    enabled: !!userId,
    ...options,
  });

// -------------------------------------------------------------
// CREATE TASK
// -------------------------------------------------------------
// in hooks/task.hooks.js
export const useCreateTask = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (res, variables) => {
      // Normalize axios-like responses
      const created = res && res.data ? res.data : res;

      queryClient.invalidateQueries(["task"]);
      queryClient.invalidateQueries(["fieldOfficerLands", variables?.userId]);

      // call caller's onSuccess with normalized created object
      options.onSuccess && options.onSuccess(created, variables);
    },
    onError: (err) => {
      options.onError && options.onError(err);
    },
    ...options,
  });
};  

// -------------------------------------------------------------
// UPDATE TASK
// -------------------------------------------------------------
export const useUpdateTask = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updatedData }) =>
      updateTaskById(taskId, updatedData),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["task"]);
      queryClient.invalidateQueries(["fieldOfficerLands", variables?.userId]);

      options.onSuccess && options.onSuccess(data, variables);
    },

    onError: (err, variables) => {
      options.onError && options.onError(err, variables);
    },

    ...options,
  });
};

// -------------------------------------------------------------
// DELETE TASK
// -------------------------------------------------------------
export const useDeleteTask = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }) => deleteTaskById(taskId),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["task"]);
      queryClient.invalidateQueries(["process"]);
      queryClient.invalidateQueries(["fieldOfficerLands", variables?.userId]);

      options.onSuccess && options.onSuccess(data, variables);
    },

    onError: (err, variables) => {
      options.onError && options.onError(err, variables);
    },

    ...options,
  });
};

export default {
  useGetAllTasks,
  useGetTasksByDiv,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
};
