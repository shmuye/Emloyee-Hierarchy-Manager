import type { Context, Next } from "hono";
export const requireRole = (roles: string[]) => {
    return async (c: Context, next: Next) => {
        const user = c.get("user");
        if (!user || !roles.includes(user.role)) {
            return c.json({ error: "Forbidden: unauthorized" }, 403);
        }
        await next();
    };
};
