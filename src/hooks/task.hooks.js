import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../api/task.js";

export const useGetAllTasks = (options = {}) => {
    return useQuery({
        queryKey: ["tasks"],
        queryFn: getAllTasks,
        ...options
    });
}

export default {
    useGetAllTasks,
};
