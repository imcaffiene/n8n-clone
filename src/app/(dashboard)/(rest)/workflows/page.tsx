import { requireAuth } from "@/lib/auth-utils";

const WorkflowPage = async () => {

  await requireAuth();


  return <div>Workflow Page</div>;
};
export default WorkflowPage;