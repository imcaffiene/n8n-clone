import { InitialNode } from "@/components/initialNode";
import { HttpRequestNode } from "@/features/executions/components/httpRequest/node";
import { ManualTriggerNode } from "@/features/trigger/components/manualTrigger/node";
import { NodeType } from "@prisma/client";
import { NodeTypes } from "@xyflow/react";

export const nodeComponent = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponent;
