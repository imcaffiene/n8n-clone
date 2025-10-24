

import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import LogoutBtn from "./logout";


const Page = async () => {
  await requireAuth();

  const data = await caller.getUser();
  return (
    <div className="flex h-screen w-screen items-center justify-center">

      Hello
      <div>
        {JSON.stringify(data)}
      </div>

      <LogoutBtn />
    </div>
  );
};

export default Page;