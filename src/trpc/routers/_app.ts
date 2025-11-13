import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/prisma";
import { createPerplexity } from "@ai-sdk/perplexity";

const perplexity = createPerplexity({
  apiKey: process.env.PERPLEXITY_API_KEY || "",
});

export const appRouter = createTRPCRouter({
  testai: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "sumit.ai",
    });
    return { success: true, message: "Event sent" };
  }),

  getWorkFlows: protectedProcedure.query(({ ctx }) => {
    return prisma.workFlow.findMany();
  }),

  createWorkFlow: protectedProcedure.mutation(() => {
    return prisma.workFlow.create({
      data: {
        name: "test-workflow",
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
