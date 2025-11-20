import { WorkflowsContainer, WorkFlowsList } from "@/features/workflows/components/workflows";
import { WorkflowParamsLoader } from "@/features/workflows/server/params-loader";
import { prefetchWokflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


type props = {
  searchParams: Promise<SearchParams>;
};

const WorkflowPage = async ({ searchParams }: props) => {

  await requireAuth();

  const params = await WorkflowParamsLoader(searchParams);

  prefetchWokflows(params);


  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Error!</p>}>
          <Suspense fallback={<p>Loading...</p>}>
            <WorkFlowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
};
export default WorkflowPage;