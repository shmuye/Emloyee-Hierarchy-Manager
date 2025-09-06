import { Hono } from "hono";
import { db } from '../db/db.ts'
import { users } from "../db/schema.ts";
import { compare, hash } from "bcrypt";
import { signJwt } from "../utils/jwt.ts";
import { loginSchema, registerSchema } from "../validations/auth.ts";

export const authController = new Hono();

// Register
authController.post("/register", async (c) => {
    const body = await c.req.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.message}, 400);

    const { email, password, role, avatar } = parsed.data;

    // Check if user exists
    const existing = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    });
    if (existing) return c.json({ error: "Email already registered" }, 400);

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert user
    const user = await db.insert(users).values({
        email,
        password: hashedPassword,
        role,
        avatar,
    }).returning();

    // Sign JWT
    const token = signJwt({ id: user[0].id, email: user[0].email, role: user[0].role });

    return c.json({ token, user: user[0] }, 201);
});

// Login
authController.post("/login", async (c) => {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.message }, 400);

    const { email, password } = parsed.data;

    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) return c.json({ error: "Invalid email or password" }, 401);

    const passwordValid = await compare(password, user.password);
    if (!passwordValid) return c.json({ error: "Invalid email or password" }, 401);

    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    return c.json({ token, user }, 200);
});
