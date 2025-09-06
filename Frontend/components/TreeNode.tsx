"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Position } from "@/types/position"
import { IconChevronRight, IconChevronDown} from '@tabler/icons-react'


interface TreeNodeProps {
    node: Position & { children?: Position[] }
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
    const [expanded, setExpanded] = useState(false)

    const hasChildren = node.children && node.children.length > 0

    return (
        <li className="mb-1">
            <div
                className="flex items-center gap-2 cursor-pointer p-2 rounded-md transition"
                onClick={() => hasChildren && setExpanded(!expanded)}
            >

                {hasChildren ? (
                    expanded ? <IconChevronDown size={16} className="text-gray-500" /> : <IconChevronRight size={16} className="text-gray-500" />
                ) : (
                    <span className="w-4" /> // empty space for alignment
                )}
              <div className="flex items-center gap-8">
                  <Link
                      href={`/Positions/${node.id}`}
                      className="text-gray-800 font-medium hover:text-blue-600 transition"
                      onClick={(e) => e.stopPropagation()} // prevent toggle when clicking link
                  >
                      {node.name}

                  </Link>
                  {
                      hasChildren &&
                      <h1 className="text-gray-500 ">
                          {node.children?.length}
                      </h1>
                  }
              </div>

            </div>


            {hasChildren && expanded && (
                <ul className="ml-6 border-l border-gray-200 pl-3 mt-1 transition-all duration-300 ease-in-out">
                    {node.children!.map((child) => (
                        <TreeNode key={child.id} node={child} />
                    ))}
                </ul>
            )}
        </li>
    )
}

export default TreeNode
