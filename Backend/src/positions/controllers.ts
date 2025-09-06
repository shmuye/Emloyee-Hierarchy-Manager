import { Hono } from "hono";
import { db } from "../db/db.ts";
import { positions } from "../db/schema.ts";
import { createPositionSchema, updatePositionSchema } from "./validation.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { requireRole } from "../middleware/roles.ts";
import { eq, and } from "drizzle-orm";
import { buildTree } from "../utils/buildTree.ts";

export const positionsController = new Hono();

// ----------------- CREATE -----------------
positionsController.post("/", authMiddleware, requireRole(["OrgAdmin"]), async (c) => {
    const body = await c.req.json();
    const parsed = createPositionSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.message }, 400);

    const { name, description, parentId } = parsed.data;
    const user = c.get("user");

    // ✅ ensure only one root position (parentId=null) exists
    if (!parentId) {
        const existingRoot = await db.query.positions.findFirst({
            where: (p, { eq, isNull }) =>
                and(eq(p.createdBy, user.id), isNull(p.parentId)),
        });
        if (existingRoot) {
            return c.json({ error: "Please select parent position" }, 400);
        }
    }

    const newPos = await db.insert(positions).values({
        name,
        description,
        parentId: parentId ?? null,
        createdBy: user.id,
    }).returning();

    return c.json({ position: newPos[0] }, 201);
});

// ----------------- PATCH (UPDATE) -----------------
positionsController.patch("/:id", authMiddleware, requireRole(["OrgAdmin"]), async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();

    const parsed = updatePositionSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.message }, 400);

    const updated = await db.update(positions)
        .set(parsed.data)
        .where(eq(positions.id, id))
        .returning();

    if (!updated.length) return c.json({ error: "Not found" }, 404);
    return c.json({ position: updated[0] }, 200);
});

// ----------------- DELETE -----------------
positionsController.delete("/:id", authMiddleware, requireRole(["OrgAdmin"]), async (c) => {
    const id = c.req.param("id");

    const existing = await db.query.positions.findFirst({
        where: (p, { eq }) => eq(p.id, id),
        with: { children: true },
    });
    if (!existing) return c.json({ error: "Not found" }, 404);

    // ✅ block deletion if children exist
    if (existing.children && existing.children.length > 0) {
        return c.json({ error: "Cannot delete a position that has children." }, 400);
    }

    await db.delete(positions).where(eq(positions.id, id));
    return c.json({ message: "Position deleted successfully." }, 200);
});

// ----------------- GET ALL (PUBLIC) -----------------
positionsController.get("/", async (c) => {
    const allPositions = await db.query.positions.findMany();
    const tree = buildTree(allPositions);
    return c.json({ tree }, 200);
});

// positionsController.get("/", async (c) => {
//     const allPositions = await db.query.positions.findMany();
//     return c.json({ positions: allPositions }, 200);
// });

// ----------------- GET SINGLE -----------------
positionsController.get("/:id" , async (c) => {
    const id = c.req.param("id");
    const pos = await db.query.positions.findFirst({
        where: (p, { eq }) => eq(p.id, id),
        with: { creator: true, parent: true, children: true },
    });
    if (!pos) return c.json({ error: "Not found" }, 404);
    return c.json(pos, 200);
});
// ----------------- GET CHILDREN -----------------
positionsController.get("/:id/children", authMiddleware, async (c) => {
    const id = c.req.param("id");
    const pos = await db.query.positions.findFirst({
        where: (p, { eq }) => eq(p.id, id),
        with: { children: true },
    });
    if (!pos) return c.json({ error: "Not found" }, 404);

    return c.json({ children: pos.children }, 200);
});
