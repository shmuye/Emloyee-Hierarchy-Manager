import { Hono } from "hono";
import { authController } from "./controllers.ts";

export const authRoutes = new Hono();

authRoutes.route("/", authController);
