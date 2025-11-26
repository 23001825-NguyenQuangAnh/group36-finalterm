import axiosClient from "./axiosClient";

export const getPerformanceOverview = async () => {
    return axiosClient.get("/performance/overview");
};