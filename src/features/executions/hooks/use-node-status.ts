import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { Realtime } from "@inngest/realtime";
import { useEffect, useState } from "react";
import { useInngestSubscription } from "@inngest/realtime/hooks";

interface UseNodeStatusOption {
  nodeId: string; // Which node to track (e.g., "node-2")
  channel: string; // Realtime channel (e.g., "workflow.run_123")
  topic: string; // Message topic (e.g., "node.status")
  refreshToken: () => Promise<Realtime.Subscribe.Token>; // Auth token generator
}

export function useNodeStatus({
  channel,
  nodeId,
  refreshToken,
  topic,
}: UseNodeStatusOption): NodeStatus {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    const lastmessage = data
      .filter(
        (msg) =>
          msg.kind === "data" && // Only data messages (not control messages)
          msg.channel === channel && // Match our workflow run
          msg.topic === topic && // Match status updates
          msg.data.nodeId === nodeId // Match this specific node
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (lastmessage?.kind === "data") {
      setStatus(lastmessage.data.status as NodeStatus);
    }
  }, [data, nodeId, channel, topic]);

  return status;
}
