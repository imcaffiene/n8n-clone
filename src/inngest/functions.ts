import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { topologicalSort } from "./utils";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
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

    return { sortedNodes };
  }
);
