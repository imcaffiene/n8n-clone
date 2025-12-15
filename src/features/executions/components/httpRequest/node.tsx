"use client";

import { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseExecutionNode } from "../baseExecutionNode";
import { GlobeIcon } from "lucide-react";

type HttpRequestNodeData = {
  endPoint?: string;
  method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {

  const nodeData = props.data;

  const description = nodeData?.endPoint ? `${nodeData.method || "GET"}:${nodeData.endPoint}` : "Not configured";

  return (
    <>
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onSetting={() => { }}
        onDoubleClick={() => { }}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";