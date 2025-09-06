import { pgTable, uuid, varchar, pgEnum, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("roles", ["OrgAdmin", "User"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: roleEnum("role").notNull().default("User"),
    avatar: varchar("avatar", { length: 512 }),
});

export const positions = pgTable("positions", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    description: text("description").notNull(),
    parentId: uuid("parent_id"), // self-referencing for hierarchy
    createdBy: uuid("created_by").notNull(), // user who created this position
});

export const usersRelations = relations(users, ({ many }) => ({
    positions: many(positions), // a user can create many positions
}));

export const positionsRelations = relations(positions, ({ one, many }) => ({
    creator: one(users, {
        fields: [positions.createdBy],
        references: [users.id],
    }),
    parent: one(positions, {
        fields: [positions.parentId],
        references: [positions.id],
        relationName: "children", // 👈 disambiguates
    }),
    children: many(positions, {
        relationName: "children", // 👈 must match parent
    }),
}));
