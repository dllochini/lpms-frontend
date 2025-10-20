import { useQuery } from "@tanstack/react-query";
import { getResources } from "../api/resources.js";

export const useGetResources = (options = {}) => {
    return useQuery({
        queryKey: ["resources"],
        queryFn: getResources,
        ...options
    });
}

export default {
    useGetResources,
};
