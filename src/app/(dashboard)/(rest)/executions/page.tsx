import { requireAuth } from "@/lib/auth-utils";

const ExecutionsPage = async () => {

  await requireAuth();

  return <div>Executions Page</div>;
};
export default ExecutionsPage;