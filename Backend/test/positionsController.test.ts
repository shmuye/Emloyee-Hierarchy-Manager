// tests/positionsController.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../src/index.js";
import { db } from "../src/db/db.ts";
import { positions, users } from "../src/db/schema.js";
import { signJwt } from "../src/utils/jwt.ts";


// create an OrgAdmin token
const adminUser = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@example.com",
    password: "123456",
    role: "OrgAdmin" as const,
};
const adminToken = signJwt(adminUser);

let createdId: string;

beforeAll(async () => {
    await db.delete(positions);
    await db.delete(users);
    // insert a user so FK constraint passes
    await db.insert(users).values(adminUser);
});

describe("positions controller", () => {
    it("OrgAdmin should create a root position", async () => {
        const res = await app.request("/positions", {
            method: "POST",
            body: JSON.stringify({
                name: "Root Position",
                description: "x".repeat(120), // meets min 100
                parentId: null,
            }),
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
        });
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.position).toBeDefined();
        createdId = data.position.id;
    });

    it("should fail creating another root position", async () => {
        const res = await app.request("/positions", {
            method: "POST",
            body: JSON.stringify({
                name: "Another Root",
                description: "x".repeat(120),
                parentId: null,
            }),
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
        });
        expect(res.status).toBe(400);
    });

    it("OrgAdmin should update a position", async () => {
        const res = await app.request(`/positions/${createdId}`, {
            method: "PATCH",
            body: JSON.stringify({
                description: "Updated description with more than 100 chars " + "x".repeat(80),
            }),
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
        });
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.position.description).toContain("Updated description");
    });

    it("GET all should return tree", async () => {
        const res = await app.request("/positions");
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.tree).toBeDefined();
        expect(Array.isArray(data.tree)).toBe(true);
    });

    it("GET single should return the created position", async () => {
        const res = await app.request(`/positions/${createdId}`);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.id).toBe(createdId);
        expect(data.creator).toBeDefined();
    });

    it("should create a child position", async () => {
        const res = await app.request("/positions", {
            method: "POST",
            body: JSON.stringify({
                name: "Child Position",
                description: "y".repeat(120),
                parentId: createdId,
            }),
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
        });
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.position.parentId).toBe(createdId);
    });

    it("GET children should return the child", async () => {
        const res = await app.request(`/positions/${createdId}/children`, {
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
        });
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.children.length).toBeGreaterThan(0);
    });

    it("should NOT delete a position with children", async () => {
        const res = await app.request(`/positions/${createdId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
        });
        expect(res.status).toBe(400);
    });
});
