import lodash from "lodash";
import { Position } from "@/types/position";

export function buildTree(positions: Position[]) {
    const grouped = lodash.groupBy(positions, (pos) => String(pos.parentId)); // keys are now strings

    function attachChildren(nodes: Position[]): (Position & { children?: Position[] })[] {
        return nodes.map((node) => ({
            ...node,
            children: attachChildren(grouped[String(node.id)] || []),
        }));
    }

    return attachChildren(grouped["null"] || []); // root nodes where parentId = null
}
