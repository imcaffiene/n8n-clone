import type { Realtime } from "@inngest/realtime";
import type { GetStepTools, Inngest } from "inngest";

export type WorkflowContext = Record<string, unknown>; // holds all data flowing through the workflow.

export type Steptools = GetStepTools<Inngest.Any>; //Allows executors to create named steps for logging, retries, and observability.

export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData; // Node configuration from React Flow
  nodeId: string; // Unique node ID
  context: WorkflowContext; // Data from previous nodes
  step: Steptools; // Inngest step helper
  publish: Realtime.PublishFn;
}

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>
) => Promise<WorkflowContext>;
