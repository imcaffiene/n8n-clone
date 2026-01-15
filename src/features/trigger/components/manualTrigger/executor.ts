import { NodeExecutor } from "@/features/executions/types";
import { manualRequestChannel } from "@/inngest/channels/mannual-request";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    manualRequestChannel().status({
      nodeId,
      status: "loading",
    })
  );
  const result = await step.run("mannual-trigger", async () => context);

  await publish(
    manualRequestChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};
