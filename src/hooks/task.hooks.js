import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTaskById, getAllTasks, getTasksByDiv, updateTaskById } from "../api/task.js";

export const useGetAllTasks = (options = {}) => {
    return useQuery({
        queryKey: ["task"],
        queryFn: getAllTasks,
        ...options
    });
}

export const useGetTasksByDiv = (userId, options = {}) =>
  useQuery({
    queryKey: ["fieldOfficerLands", userId],
    queryFn: () => getTasksByDiv(userId),
    ...options,
  });

export const useCreateTask = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // invalidate or refetch the list so UI updates
      queryClient.invalidateQueries(["task"]);
    },
    ...options, // allow passing extra handlers (onSuccess, onError etc.)
  });
};

export const useUpdateTask = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, updatedData }) => updateTaskById(taskId, updatedData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["task"]);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
};

export const useDeleteTask = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    // expect variables like: { taskId }
    mutationFn: ({ taskId }) => deleteTaskById(taskId),
    onSuccess: (data, variables) => {
      // invalidate queries so lists / related data refresh
      queryClient.invalidateQueries(["task"]);
      queryClient.invalidateQueries(["process"]); // if processes include tasks
      // other keys you use, e.g. ["workdone"] or ["processes", variables?.processId]
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    onError: (err, variables) => {
      if (options.onError) options.onError(err, variables);
    },
    ...options,
  });
};


export default {
    useGetAllTasks,
    useCreateTask,
    useUpdateTask,
    // useUpdateStatusByTask,
};
