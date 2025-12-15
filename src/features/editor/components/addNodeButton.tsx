"use client ";

import { NodeSelector } from "@/components/nodeSelector";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

export const AddNodeButton = memo(() => {

    const [selectorOpen, setSelectorOpen] = useState(false);

    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <Button

                size={"icon-sm"}
                variant={"outline"}
                className="bg-background"

            >
                <PlusIcon />
            </Button>
        </NodeSelector>
    );
});

AddNodeButton.displayName = "AddNodeButton";