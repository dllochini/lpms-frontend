import { useQuery } from "@tanstack/react-query";
import { getOperations } from "../api/operation.js";

export const useGetOperations = (options = {}) => {
  return useQuery({
    queryKey: ["operations"],
    queryFn: getOperations,
    ...options,
  });
};

export default {
  useGetOperations,
};
