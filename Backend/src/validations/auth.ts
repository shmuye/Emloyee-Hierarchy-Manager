import { z } from "zod";


export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});


export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(["OrgAdmin", "User"]).default("User"),
    avatar: z.url().optional(),
});
