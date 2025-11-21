"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView
} from "@/components/entity-component";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "@/hooks/use-entity-search";


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
  const workflows = useSuspenseWorkflows();

  if (workflows.data.item.length === 0) {
    return <WorkflowEmpty />;
  }

  return (
    <p>
      {JSON.stringify(workflows.data, null, 2)}
    </p>
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
      message="Loading wokflows"
    />
  );
};


export const WorkflowError = () => {
  return (
    <ErrorView
      message="Error loading wokflows"
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