import { Handle, Position } from "@xyflow/react";
import { Clock } from "lucide-react";

export function ScheduledTriggerNode({ data }: { data: any }) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg border-2 border-purple-400 w-24 sm:w-36 md:w-40 lg:w-30">
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">
       
        <div className="text-xs">{data.label}</div>

        <div className="flex justify-center items-center">
          <Clock className="w-8 h-8 " />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-purple-300 border-2 border-purple-500"
      />
    </div>
  );
}
