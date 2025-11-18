import prisma from "@/lib/prisma";
import { generateSlug } from "random-word-slugs";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";

// Zod schemas for validation
const updateWorkflowInput = z.object({
  id: z.string(),
  name: z.string().min(3).max(50),
});

const deleteWorkflowInput = z.object({
  id: z.string(),
});

const CreateWorkflowInput = z.object({
  name: z.string().min(3).max(50).optional(), // Allow custom names
  description: z.string().max(500).optional(),
});

export const workflowsRouter = () =>
  createTRPCRouter({
    create: premiumProcedure
      .input(CreateWorkflowInput.optional())
      .mutation(({ ctx, input }) => {
        return prisma.workFlow.create({
          data: {
            name: input?.name || generateSlug(3),
            userId: ctx.auth.user.id,
          },
        });
      }),

    remove: protectedProcedure
      .input(deleteWorkflowInput)
      .mutation(({ ctx, input }) => {
        return prisma.workFlow.delete({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
        });
      }),

    update: protectedProcedure
      .input(updateWorkflowInput)
      .mutation(({ ctx, input }) => {
        return prisma.workFlow.update({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
          data: {
            name: input.name,
          },
        });
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(({ ctx, input }) => {
        return prisma.workFlow.findUnique({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
        });
      }),

    getAll: protectedProcedure.query(({ ctx }) => {
      return prisma.workFlow.findMany({
        where: {
          userId: ctx.auth.user.id,
        },
      });
    }),
  });
