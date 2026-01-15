"use server";

import { manualRequestChannel } from "@/inngest/channels/mannual-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type ManualRequestToken = Realtime.Token<
  typeof manualRequestChannel,
  ["status"]
>;

export async function fetchManualRequestRealtimeToken(): Promise<ManualRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: manualRequestChannel(),
    topics: ["status"],
  });

  return token;
}
