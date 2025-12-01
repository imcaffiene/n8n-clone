import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.workflows.getAll>;

// prefetch all workflow
export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflows.getAll.queryOptions(params));
};

// prefetch single workflow
export const prefetchWorkflowsById = (id:string)=>{
  return prefetch(trpc.workflows.getById.queryOptions({id}))
}
