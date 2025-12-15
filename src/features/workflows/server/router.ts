import prisma from "@/lib/prisma";
import { generateSlug } from "random-word-slugs";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import { PAGINATION } from "@/config/constant";
import { NodeType } from "@prisma/client";
import { Edge, Node } from "@xyflow/react";

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
            nodes: {
              create: {
                type: NodeType.INITIAL, //starting point
                position: { x: 0, y: 0 }, //canvas position
                name: NodeType.INITIAL, //name="INITIAL"
              },
            },
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

    updateCanvas: protectedProcedure
      .input(
        z.object({
          id: z.string(), // workflow ID
          nodes: z.array(
            z.object({
              id: z.string(), // nodeId (React Flow node.id)
              type: z.string().nullish(), // "MANUAL_TRIGGER", "HTTP_REQUEST",
              position: z.object({ x: z.number(), y: z.number() }), //Canvas coordinates {x, y}
              data: z.record(z.string(), z.any()).optional(), //Custom node data (HTTP URL, email config, etc.)
            })
          ),
          // Array of connections between nodes
          edges: z.array(
            z.object({
              source: z.string(), //from node ID
              target: z.string(), // to node ID
              sourceHandle: z.string().nullish(), // Output port name
              targetHandle: z.string().nullish(), //Input port name
            })
          ),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, nodes, edges } = input;

        const workflow = await prisma.workFlow.findFirstOrThrow({
          where: { id, userId: ctx.auth.user.id },
        });

        //database transaction
        return await prisma.$transaction(async (tx) => {
          await tx.node.deleteMany({
            //
            where: { workFlowId: id },
          });

          await tx.node.createMany({
            data: nodes.map((node) => ({
              id: node.id,
              workFlowId: id,
              name: node.type || "unknown",
              type: node.type as NodeType,
              position: node.position,
              data: node.data || {},
            })),
          });

          await tx.connection.createMany({
            data: edges.map((edge) => ({
              workFlowId: id,
              fromNodeId: edge.source,
              toNodeId: edge.target,
              fromOutput: edge.sourceHandle || "main",
              toInput: edge.targetHandle || "main",
            })),
          });

          //update work flow timestamps
          await tx.workFlow.update({
            where: { id },
            data: { updatedAt: new Date() },
          });

          return workflow;
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
      .query(async ({ ctx, input }) => {
        const workflow = await prisma.workFlow.findUniqueOrThrow({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
          include: {
            nodes: true,
            connections: true,
          },
        });

        //Transform nodes for React Flow
        const nodes: Node[] = workflow.nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position as { x: number; y: number },
          data: (node.data as Record<string, unknown>) || {},
        }));

        const edges: Edge[] = workflow.connections.map((connection) => ({
          id: connection.id,
          source: connection.fromNodeId,
          target: connection.toNodeId,
          sourceHandle: connection.fromOutput,
          targetHandle: connection.toInput,
        }));

        return {
          id: workflow.id,
          name: workflow.name,
          nodes,
          edges,
        };
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
