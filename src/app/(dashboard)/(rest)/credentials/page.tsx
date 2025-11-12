import { requireAuth } from "@/lib/auth-utils";

const CredentialsPage = async () => {

  await requireAuth();


  return <div>Credentials Page</div>;
};
export default CredentialsPage;