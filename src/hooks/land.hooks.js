import { useQuery } from "@tanstack/react-query";
import { getLandsByFieldOfficerId } from "../api/land.js";

export const useGetFieldOfficerLands = (fieldOfficerId, options = {}) =>
  useQuery({
    queryKey: ["fieldOfficerLands", fieldOfficerId],
    queryFn: () => getLandsByFieldOfficerId(fieldOfficerId),
    ...options,
  });

export default {
  useGetFieldOfficerLands,
};
