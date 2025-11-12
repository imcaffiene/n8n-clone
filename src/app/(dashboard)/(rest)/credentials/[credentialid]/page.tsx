import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        credentialid: string;
    }>;
}

const CredentialIdPage = async ({ params }: PageProps) => {

    await requireAuth();

    const { credentialid } = await params;

    return (
        <p>
            Credentials id : {credentialid}
        </p>
    );
};

export default CredentialIdPage;