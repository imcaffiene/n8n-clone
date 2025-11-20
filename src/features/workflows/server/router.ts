import prisma from "@/lib/prisma";
import { generateSlug } from "random-word-slugs";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import { PAGINATION } from "@/config/constant";

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

    getAll: protectedProcedure
      .input(
        z.object({
          page: z.number().default(PAGINATION.DEFAULT_PAGE), //current page number
          pageSize: z //items per page
            .number()
            .min(PAGINATION.MIN_PAGE_SIZE)
            .max(PAGINATION.MAX_PAGE_SIZE)
            .default(PAGINATION.DEFAULT_PAGE_SIZE),
          search: z.string().default(""),
        })
      )
      .query(async ({ ctx, input }) => {
        const { page, pageSize, search } = input;

        const [item, totalCount] = await Promise.all([
          // Query 1: Get paginated workflows
          prisma.workFlow.findMany({
            skip: (page - 1) * pageSize, // Skip previous pages
            take: pageSize, // Take only this page's items
            where: {
              userId: ctx.auth.user.id, // Only current user's workflows
              name: {
                contains: search, // Search in name
                mode: "insensitive", // Case-insensitive search
              },
            },
            orderBy: {
              updatedAt: "desc", // Newest first
            },
          }),

          // Query 2: Count total workflows (for pagination info)
          prisma.workFlow.count({
            where: {
              userId: ctx.auth.user.id, // Only count user's workflows
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          }),
        ]);

        const totalPage = Math.ceil(totalCount / pageSize);
        const hasNextPage = page < totalPage;
        const hasPrevPage = page > 1;

        return {
          item,
          page,
          pageSize,
          totalCount,
          totalPage,
          hasNextPage,
          hasPrevPage,
        };
      }),
  });
