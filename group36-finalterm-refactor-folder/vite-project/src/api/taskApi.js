import axiosClient from "./axiosClient";

export const getAllTasks = () => axiosClient.get("/task/getAll");

export const createTask = (data) =>
    axiosClient.post("/task/create", data);

export const updateTask = (id, data) =>
    axiosClient.put(`/task/update/${id}`, data);

export const updateTaskStatus = (id, status) =>
    axiosClient.patch(`/task/${id}/status?status=${status}`);

export const updateTaskPriority = (id, priority) =>
    axiosClient.patch(`/task/${id}/priority?priority=${priority}`);

export const deleteTask = (id) =>
    axiosClient.delete(`/task/delete/${id}`);

export const getTodayTasks = (userId) =>
    axiosClient.get(`/task/today/${userId}`);

export const getOverdueTasks = (userId) =>
    axiosClient.get(`/task/overdue/${userId}`);
