"use client";

import { NodeProps, Position, useReactFlow } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import { memo, ReactNode } from "react";
import { WorkflowNodes } from "@/components/workflowNodes";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSetting?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    status = "initial",
    onSetting,
    onDoubleClick
  }: BaseExecutionNodeProps) => {

    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
      setNodes((currentNodes) => {
        const updateNodes = currentNodes.filter(
          (node) => node.id !== id);
        return updateNodes;
      });

      setEdges((currentEdges) => {
        const updateEdges = currentEdges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );

        return updateEdges;
      });
    };

    return (
      <WorkflowNodes
        name={name}
        description={description}
        onDelete={handleDelete}
        onSetting={onSetting}
        showToolbar={true}
      >
        <NodeStatusIndicator
          status={status}
          variant="border"
        >
          <BaseNode
            status={status}
            onDoubleClick={onDoubleClick}
          >
            <BaseNodeContent>
              {typeof Icon === 'string' ? (
                <Image src={Icon} alt={name} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id="target-1"
                type="target"
                position={Position.Left}
              />
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNodes>
    );
  });

BaseExecutionNode.displayName = "BaseExecutionNode"


