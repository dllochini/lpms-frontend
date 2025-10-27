import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllWorkDone, createWorkDone, deleteWorkDoneById } from "../api/workdone.js";

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
      // invalidate or refetch the list so UI updates
      queryClient.invalidateQueries(["workdone"]);
    },
    ...options, // allow passing extra handlers (onSuccess, onError etc.)
  });
};

export const useDeleteWorkDone = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    // expect variables like: { workId }
    mutationFn: ({ workId }) => deleteWorkDoneById(workId),
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