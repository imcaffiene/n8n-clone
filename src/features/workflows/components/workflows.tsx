"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView
} from "@/components/entity-component";
import { useCreateWorkflow, useDeleteWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { WorkFlow } from "@prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";


export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowParams();
  const { onSearchChange, searchValue } = useEntitySearch({
    params,
    setParams
  });

  return (
    <EntitySearch
      onChange={onSearchChange}
      value={searchValue}
      placeholder="Search Workflows"
    />
  );
};

export const WorkFlowsList = () => {
  // throw new Error("hi");
  const { data: workflows } = useSuspenseWorkflows();

  return (
    <EntityList
      items={workflows.item}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkFlowItems workflow={workflow} />}
      emptyView={<WorkflowEmpty />}
    />
  );
};

export const WorkflowsHeader = ({ disable }: { disable?: boolean; }) => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();
  const router = useRouter();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (err) => {
        handleError(err);
      }
    });
  };

  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New Workflows"
        disabled={disable}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowParams();

  return (
    <EntityPagination
      onPageChange={(page) => setParams({
        ...params,
        page
      })}
      page={workflows.data.page}
      totalPage={workflows.data.totalPage}
      disabled={workflows.isFetching}
    />
  );
};


export const WorkflowsContainer = ({ children }: { children: React.ReactNode; }) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};


export const WorkflowLoading = () => {
  return (
    <LoadingView
      message="Loading workflows"
    />
  );
};


export const WorkflowError = () => {
  return (
    <ErrorView
      message="Error loading workflows"
    />
  );
};


export const WorkflowEmpty = () => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (err) => {
        handleError(err);
      }
    });
  };

  return (
    <>
      {modal}
      <EmptyView
        onNew={handleCreate}
        message="You haven&apos;t created any workflows yet."
      />
    </>
  );
};

interface WorkFlowItemsProps {
  workflow: WorkFlow;
}

export const WorkFlowItems = ({ workflow }: WorkFlowItemsProps) => {

  const removeWorkflow = useDeleteWorkflow();
  const handleRemove = () => removeWorkflow.mutate({ id: workflow.id });

  return (
    <EntityItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}{" "}
          &bull; Created {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}{" "}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  );
};