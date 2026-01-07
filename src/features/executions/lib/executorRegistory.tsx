import { NodeType } from "@prisma/client";
import { NodeExecutor } from "../types";
import { mannualTriggerExecutor } from "@/features/trigger/components/manualTrigger/executor";
import { httpRequestExecutor } from "../components/httpRequest/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: mannualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.INITIAL]: mannualTriggerExecutor

};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type:${type}`);
  }
  return executor;
};