import { useQuery } from "@tanstack/react-query";
import { getLandsByDivId, getLandsByFieldOfficerId } from "../api/land.js";

export const useGetFieldOfficerLands = (fieldOfficerId, options = {}) =>
  useQuery({
    queryKey: ["fieldOfficerLands", fieldOfficerId],
    queryFn: () => getLandsByFieldOfficerId(fieldOfficerId),
    ...options,
  });

export const useGetDivLands = (managerId, options = {}) =>
  useQuery({
    queryKey: ["fieldOfficerLands", managerId],
    queryFn: () => getLandsByDivId(managerId),
    ...options,
  });

export default {
  useGetFieldOfficerLands,
  useGetDivLands,
};
