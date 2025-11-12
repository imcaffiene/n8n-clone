import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        workflowId: string;
    }>;
}

const WorkflowIdPage = async ({ params }: PageProps) => {

    await requireAuth();

    const { workflowId } = await params;

    return (
        <p>
            Workflow id : {workflowId}
        </p>
    );
};

export default WorkflowIdPage;