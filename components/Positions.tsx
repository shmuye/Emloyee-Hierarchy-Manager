"use client"

import {useQuery} from "@tanstack/react-query";
import { getPositions } from "@/lib/api"
// import { buildTree } from "@/lib/tree"
import TreeNode from "@/components/TreeNode"

const Positions = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["positions"],
        queryFn: async () => {
            const res = await getPositions();
            return res.data;
        },
    });

    if (isLoading) return <p className="text-gray-600">Loading...</p>;
    if (error instanceof Error) return <p className="text-red-500">{error.message}</p>;

    const tree = data?.tree || [];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Organization Structure</h1>

            <div className="bg-white shadow-sm rounded-xl p-4 max-h-[80vh] overflow-y-auto">
                <ul className="list-none">
                    {tree.map((root) => (
                        <TreeNode key={root.id} node={root} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Positions
