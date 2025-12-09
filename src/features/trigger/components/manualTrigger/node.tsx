import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../baseTriggerNode";
import { MousePointer2Icon } from "lucide-react";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointer2Icon}
        name="When clicking 'Execute Workflow'"
      //status={nodeStatus}
      //onSetting={handleOpenSetting}
      //onDoubleClick={handleOpenSetting}
      />
    </>
  );
});