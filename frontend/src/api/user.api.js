import api from "./axios.config.js";

export const getUsers = (params) => api.get("/users", { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.patch(`/users/${id}`, data);
export const deactivateUser = (id) => api.patch(`/users/${id}/deactivate`);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateMyProfile = (data) => api.patch("/users/me", data);
