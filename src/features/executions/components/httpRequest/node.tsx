"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../baseExecutionNode";
import { GlobeIcon } from "lucide-react";
import { HttpRequestFormValue, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
  variable?: string;  // Variable name for referencing result
  endPoint?: string; // API URL
  method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

// Renders the HTTP Request node on the React Flow canvas.

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();              //React Flow hook to update node data
  const nodeStatus = "initial";
  const handleOpenSetting = () => setDialogOpen(true);

  const handleSubmit = (values: HttpRequestFormValue) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...values
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
        defaultValues={nodeData}  // Pre-fill with existing data
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





































// ┌─────────────────────────────────────────────────────────────────────┐
// │                     HTTP REQUEST NODE COMPONENT                      │
// └─────────────────────────────────────────────────────────────────────┘

// React Flow Canvas
//     ↓
// ┌───────────────────────────────────────────────────────────────────┐
// │ HttpRequestNode (This component)                                   │
// │ ┌───────────────────────────────────────────────────────────────┐ │
// │ │ • Manages dialog open/close state                             │ │
// │ │ • Handles form submission                                     │ │
// │ │ • Updates node data in React Flow                             │ │
// │ │ • Renders visual node + dialog                                │ │
// │ └───────────────────────────────────────────────────────────────┘ │
// │                                                                     │
// │ ┌─────────────────┐         ┌─────────────────────────────────┐   │
// │ │ HttpRequestDialog│         │ BaseExecutionNode                │   │
// │ │ (Settings form)  │         │ (Visual node card)               │   │
// │ │                  │         │                                  │   │
// │ │ • Variable name  │         │ • Icon: GlobeIcon                │   │
// │ │ • Endpoint URL   │         │ • Name: "HTTP Request"           │   │
// │ │ • HTTP method    │         │ • Description: GET:/api/users    │   │
// │ │ • Request body   │         │ • Settings button                │   │
// │ └─────────────────┘         └─────────────────────────────────┘   │
// └───────────────────────────────────────────────────────────────────┘



























// ┌─────────────────────────────────────────────────────────────────────┐
// │                   COMPLETE HTTP REQUEST NODE FLOW                    │
// └─────────────────────────────────────────────────────────────────────┘

// 1. USER ADDS NODE TO CANVAS
// ────────────────────────────
// React Flow creates node:
// {
//   id: "node-2",
//   type: "HTTP_REQUEST",
//   position: { x: 200, y: 300 },
//   data: {}  // Empty initially
// }

//     ↓

// 2. NODE RENDERS (First time)
// ────────────────────────────
// HttpRequestNode component mounts:
// - dialogOpen = false
// - description = "Not configured" (no endPoint yet)
// - Renders BaseExecutionNode with "Not configured" text

// Visual:
// ┌──────────────────────┐
// │ 🌐 HTTP Request   ⚙️ │
// │ Not configured       │
// └──────────────────────┘

//     ↓

// 3. USER DOUBLE-CLICKS NODE
// ──────────────────────────
// onDoubleClick={handleOpenSetting}
//     ↓
// handleOpenSetting()
//     ↓
// setDialogOpen(true)
//     ↓
// Dialog opens

//     ↓

// 4. DIALOG SHOWS FORM
// ────────────────────
// HttpRequestDialog renders:
// - Variable name field: empty
// - Endpoint field: empty
// - Method dropdown: "GET" (default)
// - Body field: empty

//     ↓

// 5. USER FILLS FORM
// ──────────────────
// User types:
// - Variable: "githubUser"
// - Endpoint: "https://api.github.com/users/octocat"
// - Method: "GET"
// - Body: (empty)

//     ↓

// 6. USER CLICKS "SAVE"
// ─────────────────────
// Dialog calls onSubmit(values)
//     ↓
// handleSubmit({
//   variable: "githubUser",
//   endPoint: "https://api.github.com/users/octocat",
//   method: "GET",
//   body: undefined
// })

//     ↓

// 7. NODE DATA UPDATED
// ────────────────────
// setNodes((nodes) => nodes.map((node) => {
//   if (node.id === "node-2") {
//     return {
//       ...node,
//       data: {
//         variable: "githubUser",
//         endPoint: "https://api.github.com/users/octocat",
//         method: "GET",
//         body: undefined
//       }
//     };
//   }
//   return node;
// }))

// React Flow state updated:
// {
//   id: "node-2",
//   type: "HTTP_REQUEST",
//   position: { x: 200, y: 300 },
//   data: {
//     variable: "githubUser",
//     endPoint: "https://api.github.com/users/octocat",
//     method: "GET"
//   }
// }

//     ↓

// 8. COMPONENT RE-RENDERS
// ────────────────────────
// props.data changed → component re-renders
//     ↓
// description = "GET:https://api.github.com/users/octocat"
//     ↓
// BaseExecutionNode updates

// Visual:
// ┌────────────────────────────────────────────┐
// │ 🌐 HTTP Request                         ⚙️ │
// │ GET:https://api.github.com/users/octocat   │
// └────────────────────────────────────────────┘

//     ↓

// 9. USER SAVES WORKFLOW
// ──────────────────────
// User clicks "Save" in workflow editor
//     ↓
// updateCanvas mutation called
//     ↓
// Node data persisted to database:
// {
//   id: "node-2",
//   workFlowId: "workflow-123",
//   type: "HTTP_REQUEST",
//   position: { x: 200, y: 300 },
//   data: {
//     variable: "githubUser",
//     endPoint: "https://api.github.com/users/octocat",
//     method: "GET"
//   }
// }

//     ↓

// 10. USER EXECUTES WORKFLOW
// ───────────────────────────
// User clicks "Run"
//     ↓
// Inngest job started
//     ↓
// httpRequestExecutor receives:
// {
//   data: {
//     variable: "githubUser",         ← From this component
//     endPoint: "https://api.github.com/users/octocat",
//     method: "GET"
//   },
//   nodeId: "node-2",
//   context: {},
//   step: inngestStepHelper
// }

//     ↓
// Makes API call
//     ↓
// Returns:
// {
//   githubUser: {
//     httpResponse: {
//       status: 200,
//       data: { login: "octocat", id: 583231, ... }
//     }
//   }
// }

