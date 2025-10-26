"use client";

import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import LogoutBtn from "./logout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";


const Page = () => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkFlows.queryOptions());
  const create = useMutation(trpc.createWorkFlow.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.getWorkFlows.queryOptions());
    }
  }));

  return (
    <div className="flex h-screen flex-col w-screen items-center justify-center">

      Hello
      <div>
        {JSON.stringify(data)}
      </div>
      <Button disabled={create.isPending} onClick={() => create.mutate}>
        Create Workflow
      </Button>
      <LogoutBtn />
    </div>
  );
};

export default Page;