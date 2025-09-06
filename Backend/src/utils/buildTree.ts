import type { InferSelectModel } from "drizzle-orm";
import { positions } from "../db/schema.ts";

type Position = InferSelectModel<typeof positions>;

export const buildTree = (allPositions: Position[], parentId: string | null = null): any[] => {
    return allPositions
        .filter((p) => p.parentId === parentId)
        .map((p) => ({
            ...p,
            children: buildTree(allPositions, p.id),
        }));
};
