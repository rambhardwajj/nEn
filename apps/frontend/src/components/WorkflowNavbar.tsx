import { useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Save } from "lucide-react";

interface WorkflowNavbarProps {
  projectName?: string;
  isActive?: boolean;
  onSave?: () => void;
  onActiveToggle?: (active: boolean) => void;
}

export function WorkflowNavbar({ 
  projectName = "My Project Name",
  isActive = false,
  onSave,
  onActiveToggle 
}: WorkflowNavbarProps) {
  const [active, setActive] = useState(isActive);

  const handleActiveToggle = (checked: boolean) => {
    setActive(checked);
    onActiveToggle?.(checked);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-16 mt-2 rounded-sm mr-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
          {projectName}
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Active Switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            Active
          </span>
          <Switch
            checked={active}
            onCheckedChange={handleActiveToggle}
            className="data-[state=checked]:bg-teal-500"
          />
          <span className="text-xs text-gray-500 sm:hidden">
            {active ? "On" : "Off"}
          </span>
        </div>

        <Button
          onClick={onSave}
          className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 flex items-center gap-2 transition-colors"
          size="sm"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
      </div>
    </nav>
  );
}