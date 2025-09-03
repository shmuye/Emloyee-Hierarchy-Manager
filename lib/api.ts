
import axios from "axios";
import { Position } from "@/types/position";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getPositions = () => api.get<{tree: Position[]}>("/positions");

export const getPositionById = (id: string) => api.get<{position: Position}>(`/positions/${id}`);
export const createPosition = (data: Omit<Position, "id">) =>
    api.post("/positions", data);
export const updatePosition = (id: string, data: Partial<Position>) =>
    api.patch(`/positions/${id}`, data);
export const deletePosition = (id: string) => api.delete(`/positions/${id}`);
export const login = (data: { email: string; password: string }) => api.post("/auth/login", data);
export const registerUser = (data:
                         {
                             email: string;
                             password: string;
                             role: "OrgAdmin" | "User"
                         }) => api.post("/auth/register", data);

export default api;

