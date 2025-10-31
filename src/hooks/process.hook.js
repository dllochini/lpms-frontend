import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProcess, deleteProcessById, getProcessByLandId, updateProcessById } from "../api/process.js";

export const useGetProcessByLandId = (landId, options = {}) => {
    console.log("in hook")
  return useQuery({
    queryKey: ["processes", landId],
    queryFn: () => getProcessByLandId(landId),
    enabled: !!landId, // don't run until landId exists
    ...options,
  });
};


export const useUpdateProcessById = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ processId, updatedData }) => updateProcessById(processId, updatedData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["process"]);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
};

export const useCreateProcess = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ landId, ...data }) => createProcess(data),
    onSuccess: (_, variables) => {
      // invalidate the exact query key
      queryClient.invalidateQueries(["processes", variables.landId]);
      if (options.onSuccess) options.onSuccess();
    },
    ...options,
  });
};



export const useDeleteProcess = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    // expect variables like: { processId }
    mutationFn: ({ processId }) => deleteProcessById(processId),
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

export default { useGetProcessByLandId,
  useUpdateProcessById,
  useCreateProcess,
  useDeleteProcess,
 };
