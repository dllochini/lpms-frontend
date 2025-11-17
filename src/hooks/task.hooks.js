import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTaskById,
  getAllTasks,
  getTasksByDiv,
  updateTaskById,
} from "../api/task.js";

export const useGetAllTasks = (options = {}) => {
  return useQuery({
    queryKey: ["task"],
    queryFn: getAllTasks,
    ...options,
  });
};

export const useGetTasksByDiv = (userId, options = {}) =>
  useQuery({
    queryKey: ["fieldOfficerLands", userId],
    queryFn: () => getTasksByDiv(userId),
    enabled: !!userId,
    ...options,
  });

export const useCreateTask = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (res, variables) => {
      const created = res && res.data ? res.data : res;

      queryClient.invalidateQueries(["task"]);
      queryClient.invalidateQueries(["fieldOfficerLands", variables?.userId]);
      options.onSuccess && options.onSuccess(created, variables);
    },
    onError: (err) => {
      options.onError && options.onError(err);
    },
    ...options,
  });
};

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
