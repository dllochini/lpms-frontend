import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllWorkDone, createWorkDone } from "../api/workdone.js";

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
