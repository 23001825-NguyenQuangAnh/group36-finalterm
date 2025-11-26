import axiosClient from "./axiosClient";

// Lấy tất cả category
export const getAllCategories = () =>
    axiosClient.get("/category/getAll");

// Tạo category mới
export const createCategory = (data) =>
    axiosClient.post("/category/create", data);

// Cập nhật category
export const updateCategory = (id, data) =>
    axiosClient.put(`/category/update/${id}`, data);

// Xóa category
export const deleteCategory = (id) =>
    axiosClient.delete(`/category/delete/${id}`);

// Lấy category theo id
export const getCategoryById = (id) =>
    axiosClient.get(`/category/getById/${id}`);
