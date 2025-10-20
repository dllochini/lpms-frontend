import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getAllTasks, updateTaskById } from "../api/task.js";

export const useGetAllTasks = (options = {}) => {
    return useQuery({
        queryKey: ["task"],
        queryFn: getAllTasks,
        ...options
    });
}

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

export default {
    useGetAllTasks,
    useCreateTask,
    useUpdateTask,
    // useUpdateStatusByTask,
};
