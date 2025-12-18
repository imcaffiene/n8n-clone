"use client";

import { ErrorView, LoadingView } from "@/components/entity-component";
import { nodeComponent } from "@/config/node-components";
import { useSuspenseWorkflowsById } from "@/features/workflows/hooks/use-workflows";
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Node,
    type Edge,
    type NodeChange,
    type EdgeChange,
    Connection,
    Background,
    Controls,
    MiniMap,
    Panel
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useCallback, useState } from "react";
import { AddNodeButton } from "./addNodeButton";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";


export const Editor = ({ workflowId }: { workflowId: string; }) => {
    const { data: workflow } = useSuspenseWorkflowsById(workflowId); //fetch the workflow

    const setEditor = useSetAtom(editorAtom);

    //local react state for nodes & state
    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        <div className="size-full">
            <ReactFlow
                nodes={nodes} // Array of node objects to render
                edges={edges} // Array of edge objects to render
                onNodesChange={onNodesChange} // when nodes change (drag, select, delete)
                onEdgesChange={onEdgesChange} // when edges change (select, delete)
                onConnect={onConnect} // when user creates new connection
                nodeTypes={nodeComponent} // node type
                onInit={setEditor} //  Store React Flow instance --> Makes instance accessible globally
                fitView // Auto-fit canvas to show all nodes
                snapGrid={[10, 10]}
                snapToGrid // for alignment
                panOnScroll
                panOnDrag={false}
                selectionOnDrag
            >
                <Background />
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                    <AddNodeButton />
                </Panel>
            </ReactFlow>
        </div>
    );
};


export const EditorLoading = () => {
    return (<LoadingView message="Loading Editor..." />);
};

export const EditorError = () => {
    return (<ErrorView message="Error Loading Editor." />);
};










// ┌──────────────────────────────────────────────────────────────────┐
// │                    EDITOR COMPONENT FLOW                          │
// ├──────────────────────────────────────────────────────────────────┤
// │                                                                   │
// │  1. MOUNT & LOAD DATA                                            │
// │     ──────────────────                                           │
// │     <Editor workflowId="clx123" />                               │
// │         ↓                                                         │
// │     useSuspenseWorkflowsById("clx123")                           │
// │         ↓                                                         │
// │     Component SUSPENDS                                            │
// │         ↓                                                         │
// │     Fetch from API: workflows.getById({ id: "clx123" })          │
// │         ↓                                                         │
// │     Data arrives: { nodes: [...], edges: [...]; }                 │
// │         ↓                                                         │
// │     Component renders                                             │
// │                                                                   │
// │  ════════════════════════════════════════════════════════════════│
// │                                                                   │
// │  2. INITIALIZE STATE                                             │
// │     ─────────────────                                            │
// │     const [nodes, setNodes] = useState(workflow.nodes)           │
// │     const [edges, setEdges] = useState(workflow.edges)           │
// │         ↓                                                         │
// │     Local state initialized with backend data                    │
// │                                                                   │
// │  ════════════════════════════════════════════════════════════════│
// │                                                                   │
// │  3. RENDER REACT FLOW                                            │
// │     ──────────────────                                           │
// │     <ReactFlow                                                   │
// │ nodes={nodes}          ← Local state                       │
// │ edges={edges}          ← Local state                       │
// │ onNodesChange={...}    ← Update on drag /select / delete      │
// │       onEdgesChange = { ...}    ← Update on select / delete           │
// │       onConnect = { ...}        ← Add new edge on connection        │
// │       onInit = { setEditor }     ← Store instance in Jotai           │
// │     />                                                           │
// │                                                                   │
// │  ════════════════════════════════════════════════════════════════│
// │                                                                   │
// │  4. USER INTERACTIONS                                            │
// │     ──────────────────                                           │
// │                                                                   │
// │     A) User drags node:                                          │
// │        React Flow → onNodesChange([{ type: 'position', ... }])  │
// │        → applyNodeChanges → setNodes → State updates             │
// │        → Re - render with new position                             │
// │                                                                   │
// │     B) User connects nodes:                                      │
// │        React Flow → onConnect({ source, target, ... })           │
// │        → addEdge → setEdges → State updates                      │
// │        → Re - render with new edge                                 │
// │                                                                   │
// │     C) User deletes node:                                        │
// │        React Flow → onNodesChange([{ type: 'remove', ... }])    │
// │        → applyNodeChanges → setNodes → State updates             │
// │        → Re - render without node                                  │
// │                                                                   │
// │  ════════════════════════════════════════════════════════════════│
// │                                                                   │
// │  5. SAVE WORKFLOW                                                │
// │     ──────────────                                               │
// │     User clicks Save button(in another component)               │
// │         ↓                                                         │
// │     const editor = useAtomValue(editorAtom)                      │
// │     const nodes = editor.getNodes()  ← Current local state       │
// │     const edges = editor.getEdges()  ← Current local state       │
// │         ↓                                                         │
// │     saveWorkflow.mutate({ id, nodes, edges })                    │
// │         ↓                                                         │
// │     Backend saves to database                                    │
// │         ↓                                                         │
// │     Toast: "Workflow saved"                                      │
// │                                                                   │
// └──────────────────────────────────────────────────────────────────┘
