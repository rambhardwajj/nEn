import { Handle, Position } from "@xyflow/react";
import { Webhook } from "lucide-react";

export function WebhookTriggerNode({ data }: { data: any }) {
  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg border-2 border-green-400 w-32 sm:w-36 md:w-20 lg:w-30">
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mb-1 sm:mb-1.5 md:mb-2"></div>
        <div className="text-sm">{data.label}</div>

        <div className="flex justify-center items-center">
          <Webhook className="w-8 h-8 " />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-300 border-2 border-green-500"
      />
    </div>
  );
}
