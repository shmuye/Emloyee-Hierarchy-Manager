import { Position } from "@/types/position";

export const flattenPositions = (
    nodes: Position[]
): { value: string; label: string }[] => {
    return nodes.flatMap((node) => [
        { value: String(node.id), label: node.name }, // 👈 only the node name
        ...(node.children ? flattenPositions(node.children) : []),
    ]);
};
