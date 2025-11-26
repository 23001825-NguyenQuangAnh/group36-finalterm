import axiosClient from "./axiosClient";

export const createNotification = (data) =>
    axiosClient.post("/notification/create", data);

export const getUserNotifications = (userId) =>
    axiosClient.get(`/notification/getAll/${userId}`);

export const markAsRead = (id) =>
    axiosClient.put(`/notification/read/${id}`);