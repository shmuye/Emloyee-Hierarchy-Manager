"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hook"
import { fetchPositions } from "@/store/slices/positionSlice"
import { buildTree } from "@/lib/tree"
import TreeNode from "@/components/TreeNode"

const Positions = () => {
    const { positions, loading, error } = useAppSelector((state) => state.positions)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchPositions())
    }, [dispatch])

    if (loading) return <p className="text-gray-600">Loading...</p>
    if (error) return <p className="text-red-500">{error}</p>

    const tree = buildTree(positions)

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-6"> Organization Structure</h1>

            <div className="bg-white shadow-sm rounded-xl p-4 max-h-[80vh] overflow-y-auto">
                <ul className="list-none">
                    {tree.map((root) => (
                        <TreeNode key={root.id} node={root} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Positions
