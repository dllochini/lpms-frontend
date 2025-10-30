import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBill, getBillsByDiv, getBillByProcess, updateBillById } from "../api/bill.js";

export const useCreateBill = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ processId, ...data }) => createBill({ processId, ...data }),
    onSuccess: (_, variables) => {
      if (variables?.processId) {
        queryClient.invalidateQueries(["bills", variables.processId]);
      }
      if (options.onSuccess) options.onSuccess();
    },
    ...options,
  });
};

export const useGetBillsByDiv = (userId, options = {}) =>
  useQuery({
    queryKey: ["pendingBills", userId],
    queryFn: () => getBillsByDiv(userId),
    ...options,
  });

  export const useGetBillByProcess = (processId, options = {}) =>
  useQuery({
    queryKey: ["pendingBills", processId],
    queryFn: () => getBillByProcess(processId),
    ...options,
  });

  export const useUpdateBillById = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ billId, updatedData }) => updateBillById(billId, updatedData),
      onSuccess: (data) => {
        queryClient.invalidateQueries(["bills"]);
        if (options.onSuccess) options.onSuccess(data);
      },
      onError: (err) => {
        if (options.onError) options.onError(err);
      },
      ...options,
    });
  };
