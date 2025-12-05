import { InitialNode } from "@/components/initialNode";
import { NodeType } from "@prisma/client";
import { NodeTypes } from "@xyflow/react";

export const nodeComponent = {
    [NodeType.INITIAL] :InitialNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponent