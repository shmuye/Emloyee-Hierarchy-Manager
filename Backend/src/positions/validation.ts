import { z } from "zod";


export const createPositionSchema = z.object({
    name: z.string(),
    description: z.string().min(100),
    parentId: z.uuid().nullable().optional(),
});

export const updatePositionSchema = createPositionSchema.partial();


