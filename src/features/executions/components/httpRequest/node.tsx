"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../baseExecutionNode";
import { GlobeIcon } from "lucide-react";
import { FormType, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
  endPoint?: string;
  method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = "initial";
  const handleOpenSetting = () => setDialogOpen(true);

  const handleSubmit = (values: FormType) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            endPoint: values.endPoint,
            method: values.method,
            body: values.body
          }
        };
      }
      return node;
    }));
  };

  const nodeData = props.data;
  const description = nodeData?.endPoint ? `${nodeData.method || "GET"}:${nodeData.endPoint}` : "Not configured";


  return (
    <>
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultEndpoint={nodeData.endPoint}
        defaultBody={nodeData.body}
        defaultMethod={nodeData.method}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onSetting={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        status={nodeStatus}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";