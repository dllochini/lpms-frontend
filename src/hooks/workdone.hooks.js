import { useQuery} from "@tanstack/react-query";
import { getAllWorkDone } from "../api/workdone.js";

export const useGetAllWorkDone = (options = {}) => {
    return useQuery({
        queryKey: ["workdone"],
        queryFn: getAllWorkDone,
        ...options
    });
}