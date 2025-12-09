"use client";

import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { WorkflowNodes } from "./workflowNodes";
import { NodeSelector } from "./nodeSelector";

export const InitialNode = memo((props: NodeProps) => {

    const [selectorOpen, setSelectorOpen] = useState(false);

    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <WorkflowNodes showToolbar={false}>
                <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
                    <div className="cursor-pointer flex items-center justify-center">
                        <PlusIcon className="size-4" />
                    </div>
                </PlaceholderNode>
            </WorkflowNodes>
        </NodeSelector>
    );
});

InitialNode.displayName = "InitialNode";