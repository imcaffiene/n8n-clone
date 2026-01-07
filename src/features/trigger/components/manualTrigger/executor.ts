import { NodeExecutor } from "@/features/executions/types";

type MannualTriggerData = Record<string, unknown>;

export const mannualTriggerExecutor: NodeExecutor<MannualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  const result = await step.run("mannual-trigger", async () => context);

  return result;
};
