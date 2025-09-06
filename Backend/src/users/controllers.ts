import { db } from "../db/db.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import type { Context } from "hono";

export const getUserProfile = async (c: Context) => {
    const user = c.get("user"); // JWT payload from authMiddleware

    if (!user || !user.id) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const result = await db
        .select({
            id: users.id,
            email: users.email,
            role: users.role,
            avatar: users.avatar,
        })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

    if (!result.length) {
        return c.json({ error: "User not found" }, 404);
    }

    return c.json(result[0]);
};
