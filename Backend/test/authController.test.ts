import { describe, it, expect , beforeAll, vi} from "vitest";
import { app}  from '../src/index.ts'
import { db }  from '../src/db/db.ts'
import { users } from '../src/db/schema.ts'



beforeAll(async () => {
    await db.delete(users)
})

describe("Auth Controller - Register", () => {
    it("should register a new user", async () => {
        const res = await app.request("/auth/register",  {
            method: "POST",
            body: JSON.stringify({
                email: "test@example.com",
                password: "password123",
                role: "User",
                avatar: "https://example.com/avatar.png",
            }),
            headers: { "Content-Type": "application/json" },
        })


        expect(res.status).toBe(201);
        const data = await res.json()
        expect(data).toHaveProperty("token");
        expect(data.user.email).toBe("test@example.com");
    });

    it("should not register with existing email", async () => {
        const res = await app.request("/auth/register",  {
            method: "POST",
            body: JSON.stringify({
                email: "test@example.com",
                password: "password123",
                role: "User",
                avatar: "https://example.com/avatar.png",
            }),
            headers: { "Content-Type": "application/json" },
        })

        expect(res.status).toBe(400);
        const data = await res.json()
        expect(data.error).toBe("Email already registered");
    });
});

// --- Login Tests ---
describe("Auth Controller - Login", () => {
    it("should login an existing user", async () => {
        const res = await app.request("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: "test@example.com",
                password: "password123",
            }),
            headers: { "Content-Type": "application/json" },
        })


        expect(res.status).toBe(200);
        const data = await res.json()
        expect(data).toHaveProperty("token");
        expect(data.user.email).toBe("test@example.com");
    });

    it("should reject invalid password", async () => {
        const res = await app.request("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: "test@example.com",
                password: "password1234",
            }),
            headers: { "Content-Type": "application/json" },
        })

        expect(res.status).toBe(401);
        const data = await res.json()
        expect(data.error).toBe("Invalid email or password");
    });
});