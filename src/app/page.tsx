"use client";

import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

const data = await prisma.user.findMany();

const Page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Button onClick={() => { alert("hi amazon"); }} className="text-gray-300 font-extrabold">
        hi amazon
      </Button>


    </div>
  );
};

export default Page;