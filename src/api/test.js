import axiosBackend from "../configs/axios-config";

export const sampleGetAPI = async () => axiosBackend.get("/users");

export default {
    sampleGetAPI,
}