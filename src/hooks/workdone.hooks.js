import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllWorkDone,
  createWorkDone,
  deleteWorkDoneById,
} from "../api/workdone.js";

export const useGetAllWorkDone = (options = {}) => {
  return useQuery({
    queryKey: ["workdone"],
    queryFn: getAllWorkDone,
    ...options,
  });
};

export const useCreateWorkDone = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkDone,
    onSuccess: () => {
      queryClient.invalidateQueries(["workdone"]);
    },
    ...options,
  });
};

export const useDeleteWorkDone = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workId }) => deleteWorkDoneById(workId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["task"]);
      queryClient.invalidateQueries(["process"]);
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    onError: (err, variables) => {
      if (options.onError) options.onError(err, variables);
    },
    ...options,
  });
};
