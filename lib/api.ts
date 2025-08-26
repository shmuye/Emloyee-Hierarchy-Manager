// lib/api.ts
import axios from "axios";
import { Position } from "@/types/position";

const api = axios.create({
    baseURL: "http://localhost:3000", // Mockoon server
    headers: {
        "Content-Type": "application/json",
    },
});

export const getPositions = () => api.get<Position[]>("/positions");

export const getPositionById = (id: number) => api.get<Position>(`/positions/${id}`);
export const createPosition = (data: Omit<Position, "id">) =>
    api.post("/positions", data);
export const updatePosition = (id: number, data: Partial<Position>) =>
    api.patch(`/positions/${id}`, data);
export const deletePosition = (id: number) => api.delete(`/positions/${id}`);
