"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../baseTriggerNode";
import { MousePointer2Icon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpenSetting = () => setDialogOpen(true);
  const nodeStatus = "initial";

  return (
    <>
      <ManualTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseTriggerNode
        {...props}
        icon={MousePointer2Icon}
        name="When clicking 'Execute Workflow'"
        status={nodeStatus}
        onSetting={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
      />
    </>
  );
});