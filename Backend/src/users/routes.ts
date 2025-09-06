import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.ts";
import { getUserProfile } from "./controllers.ts";

export const usersRoutes = new Hono();
usersRoutes.get("/me", authMiddleware, getUserProfile);
