import { Button } from "@/components/animate-ui/components/buttons/button";
import { ZapIcon } from "@/components/animate-ui/icons/zap";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";

export const ExecuteWorkFlowButton = ({ workflowId }: { workflowId: string; }) => {

  const executeWorkflow = useExecuteWorkflow();

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId });
  };


  return (
    <Button size={"lg"} onClick={handleExecute} disabled={executeWorkflow.isPending}>
      <ZapIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};