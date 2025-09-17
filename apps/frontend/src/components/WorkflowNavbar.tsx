/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Save, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ActionForm, availableActions, type ActionI } from "@/lib/Actions";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useWorkflowStore } from "@/store/workflowStore";

interface WorkflowNavbarProps {
  projectName?: string;
  isActive?: boolean;
  onSave?: () => void;
  onActiveToggle?: (active: boolean) => void;
  isSaving?: boolean;
}

export function WorkflowNavbar({
  projectName = "My Project Name",
  isActive = false,
  onSave,
  onActiveToggle,
  isSaving = false,
}: WorkflowNavbarProps) {
  const [dialogState, setDialogState] = useState("actions");
  const [selectedAction, setSelectedAction] = useState<ActionI | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get addActionNode from store
  const addActionNode = useWorkflowStore((state) => state.addActionNode);

  const handleActionSelect = (action: ActionI) => {
    setSelectedAction(action);
    setDialogState("form");
  };

  const handleBackToActions = () => {
    setDialogState("actions");
    setSelectedAction(null);
  };

  const handleFormSubmit = (data: {
    action: ActionI;
    formData: any;
    credentials: any;
    metadata: any;
  }) => {
    console.log("Form submitted:", data);
    console.log("Action:", data.action);
    console.log("Form Data:", data.formData);
    console.log("Credentials:", data.credentials);
    console.log("Metadata:", data.metadata);

    addActionNode({
      name: data.action.name,
      type: data.action.type,
      application: data.action.application,

      config: data.formData,
      credentials: data.credentials,
      metadata: data.metadata,
      actionDefinition: data.action,
    });

    // Reset dialog state and close
    setDialogState("actions");
    setSelectedAction(null);
    setIsDialogOpen(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset dialog state when closing
      setDialogState("actions");
      setSelectedAction(null);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-16 mt-2 rounded-sm mr-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <h1 className="text-md font-semibold text-gray-900 truncate">
          {projectName}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            Active
          </span>
          <Switch
            checked={isActive}
            onCheckedChange={onActiveToggle}
            className="data-[state=checked]:bg-teal-500"
          />
          <span className="text-xs text-gray-500 sm:hidden">
            {isActive ? "On" : "Off"}
          </span>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black cursor-pointer border-1 border-b-3 hover:bg-teal-100 border-neutral-700">
              Add Action
            </Button>
          </DialogTrigger>

          <DialogContent>
            {dialogState === "actions" && (
              <div className="flex flex-col max-h-[50vh] overflow-scroll">
                <DialogTitle className="font-semibold text-teal-600 text-lg mb-2">
                  Select the Action
                </DialogTitle>
                {availableActions.map((action) => {
                  return (
                    <div className="ml-5" key={action.id}>
                      <div
                        onClick={() => handleActionSelect(action)}
                        className="flex cursor-pointer bg-teal-50 items-center w-[90%] gap-2 py-1 my-1 px-2 border border-neutral-300 rounded-sm hover:bg-teal-100 transition-colors"
                      >
                        <span>{action.icon}</span>
                        <div>{action.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {dialogState === "form" && selectedAction && (
              <ActionForm
                action={selectedAction}
                onBack={handleBackToActions}
                onSubmit={handleFormSubmit}
              />
            )}
          </DialogContent>
        </Dialog>

        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          size="sm"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isSaving ? "Saving..." : "Save"}
          </span>
        </Button>
      </div>
    </nav>
  );
}
