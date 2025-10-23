

import { requireAuth } from "@/lib/auth-utils";


const Page = async () => {
  await requireAuth();
  return (
    <div className="flex h-screen w-screen items-center justify-center">

      Hello
    </div>
  );
};

export default Page;