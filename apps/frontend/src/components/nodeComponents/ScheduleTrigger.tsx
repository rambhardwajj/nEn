// components/ScheduledTriggerNode.tsx
import { Handle, Position } from "@xyflow/react";
import { Clock } from "lucide-react";

export function ScheduledTriggerNode({ data }: { data:any }) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg border-2 border-purple-400 w-32 sm:w-36 md:w-40 lg:w-44">
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mb-1 sm:mb-1.5 md:mb-2">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-purple-200 rounded-full"></div>
          <span className="text-xs sm:text-xs md:text-xs font-medium opacity-80">SCHEDULE TRIGGER</span>
        </div>
                  <div className="text-sm">{data.label}</div>

        <div className="flex justify-center items-center">
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
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