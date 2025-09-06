
import { verifyJwt } from "../utils/jwt.ts";

export const authMiddleware = async (c: any, next: any) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.json({ error: "Missing Authorization header" }, 401);

    const token = authHeader.split(" ")[1];
    const payload = verifyJwt(token);
    if (!payload) return c.json({ error: "Invalid token" }, 401);

    // Attach user payload to context
    c.set("user", payload);
    await next();
};
