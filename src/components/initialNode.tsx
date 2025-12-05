"use client";

import { memo } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { WorkflowNodes } from "./workflowNodes";

export const InitialNode = memo((props: NodeProps) => {
    return (
        <WorkflowNodes showToolbar={false}>
            <PlaceholderNode {...props}>
                <div className="cursor-pointer flex items-center justify-center">
                    <PlusIcon className="size-4" />
                </div>
            </PlaceholderNode>
        </WorkflowNodes>
    );
});

InitialNode.displayName = "InitialNode";