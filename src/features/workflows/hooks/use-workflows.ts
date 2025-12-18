import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowParams } from "./use-workflow-params";

// Hook to fetch all workflows with suspense

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowParams();
  return useSuspenseQuery(trpc.workflows.getAll.queryOptions(params));
};

// hook to fetch single workflow

export const useSuspenseWorkflowsById = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.getById.queryOptions({ id }));
};

// hook to create new work flow
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" created`);
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}));
      },
      onError: (err) =>
        toast.error(`Failed to create workflow: ${err.message}`),
    })
  );
};

// hook to delete workflow

export const useDeleteWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" deleted`);
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getById.queryFilter({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to delete workflow: ${error.message}`);
      },
    })
  );
};

//hook to update workflow name

export const useUpdateWorkflowName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" updated`);
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getById.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update workflow: ${error.message}`);
      },
    })
  );
};

// hook to update wokflow canvas

export const useUpdateWorkflowCanvas = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.updateCanvas.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" saved`);
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({})); // Mark queries as stale → refetch
        queryClient.invalidateQueries(
          trpc.workflows.getById.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update workflow: ${error.message}`);
      },
    })
  );
};
