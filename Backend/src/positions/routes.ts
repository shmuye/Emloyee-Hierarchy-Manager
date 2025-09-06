// src/positions/routes.ts
import { Hono } from "hono";
import { positionsController } from "./controllers.ts";

export const positionsRoutes = new Hono();

positionsRoutes.route("/", positionsController);
