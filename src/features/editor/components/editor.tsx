"use client";

import { ErrorView, LoadingView } from "@/components/entity-component";
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
    MiniMap
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useCallback, useState } from "react";

// Nodes = Processing steps
const initialNodes = [
    {
        id: 'n1',
        position: { x: 0, y: 0 },
        data: { label: 'Node 1' }
    },
    {
        id: 'n2',
        position: { x: 0, y: 100 },
        data: { label: 'Node 2' }
    },
];

//Edges = Connection b/t step
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];


export const Editor = ({ workflowId }: { workflowId: string; }) => {
    const { data: workflow } = useSuspenseWorkflowsById(workflowId);

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

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
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView

            >
                <Background />
                <Controls />
                <MiniMap />
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