"use client";

import { EntityContainer, EntityHeader } from "@/components/entity-component";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

export const WorkFlowsList = () => {
  const workflows = useSuspenseWorkflows();

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


export const WorkflowsContainer = ({ children }: { children: React.ReactNode; }) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  );
};