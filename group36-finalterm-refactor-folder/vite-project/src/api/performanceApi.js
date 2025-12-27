import axiosClient from "./axiosClient";

export const getPerformanceOverview = () =>
    axiosClient.get("/performance/overview");

export const getPerformanceCharts = () =>
    axiosClient.get("/performance/charts");
