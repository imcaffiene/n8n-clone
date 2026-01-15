import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { topologicalSort } from "./utils";
import { NodeType } from "@prisma/client";
import { getExecutor } from "@/features/executions/lib/executorRegistory";
import { httpRequestChannel } from "./channels/http-request";
import { manualRequestChannel } from "./channels/mannual-request";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 2 },
  {
    event: "workflows/execute.workflow",
    channels: [httpRequestChannel(), manualRequestChannel()],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("WorkflowId is missing");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workFlow.findFirstOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    let context = event.data.initialData || {};

    //Loop through sorted nodes, execute each one.
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return {
      workflowId,
      result: context,
    };
  }
);
