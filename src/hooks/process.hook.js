import { useQuery } from "@tanstack/react-query";
import { getProcessByLandId } from "../api/process.js";

export const useGetProcessByLandId = (landId, options = {}) => {
    console.log("in hook")
  return useQuery({
    queryKey: ["processes", landId],
    queryFn: () => getProcessByLandId(landId),
    enabled: !!landId, // don't run until landId exists
    ...options,
  });
};

export default { useGetProcessByLandId };
