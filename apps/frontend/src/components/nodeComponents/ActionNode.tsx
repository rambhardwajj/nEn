// components/nodeComponents/ActionNode.tsx
import { Handle, Position } from "@xyflow/react";
import { Settings, Trash, Mail, Database, Webhook, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
// import { useWorkflowStore } from "@/store/workflowStore";

const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case "TelegramNodeType":
      return <Send className="w-6 h-6 text-white" />;
    // case "GmailNodeType":
    //   return <Mail className="w-6 h-6 text-white" />;
    case "openAiNodeType":
      return <Database className="w-6 h-6 text-white" />;
    case "WebHookNodeType":
      return <Webhook className="w-6 h-6 text-white" />;
    case "EmailNodeType":
      return <Mail className="w-6 h-6 text-white" />;
    default:
      return <Settings className="w-6 h-6 text-white" />;
  }
};

const getActionColor = (actionType: string) => {
  switch (actionType) {
    case "TelegramNodeType":
      return "bg-cyan-600/70";
    // case "GmailNodeType":
    //   return "bg-red-600";
    case "openAiNodeType":
      return "bg-green-600";
    case "WebHookNodeType":
      return "bg-purple-600";
    case "EmailTriggerType":
      return "bg-orange-600"
    default:
      return "bg-gray-600";
  }
};

const getActionDisplayName = (actionType: string) => {
  switch (actionType) {
    case "TelegramNodeType":
      return "Telegram";
    // case "GmailNodeType":
    //   return "Gmail";
    case "openAiNodeType":
      return "OpenAI";
    case "WebHookNodeType":
      return "Webhook";
    case "EmailTriggerType":
      return "gmailOAuth2"
    default:
      return "Action";
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ActionNode({ data, id }: { data: any; id: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //   const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const actionType = data.actionType || data.type;
  const actionColor = getActionColor(actionType);
  const actionIcon = getActionIcon(actionType);
  const displayName = getActionDisplayName(actionType);

  const handleDelete = () => {
    console.log(`Delete node ${id}`);
  };

  return (
    <div className={` rounded-l-4xl ${actionColor} relative `}>
      {/* settings icon  */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Settings className="absolute opacity-80 w-3 h-3 -top-2 bg-neutral-100 text-black rounded-full right-0 cursor-pointer p-0.5" />
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogTitle>Action Configuration</DialogTitle>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {actionIcon}
              <div>
                <h3 className="font-semibold">{displayName}</h3>
                <p className="text-sm text-gray-600">{data.application}</p>
              </div>
            </div>

            {/* config details */}
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-2">Configuration:</h4>
              {data.parameters ? (
                <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                  {JSON.stringify(data.parameters, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-gray-500">
                  No parameters configured
                </p>
              )}
            </div>

            {/* cred info */}
            {data.credentials && (
              <div className="bg-green-50 p-3 rounded-md">
                <h4 className="font-medium mb-1">Credentials:</h4>
                <p className="text-sm">
                  {data.credentials.name} ({data.credentials.application})
                </p>
              </div>
            )}

            {!data.credentials && data.application && (
              <div className="bg-yellow-50 p-3 rounded-md">
                <h4 className="font-medium mb-1">Warning:</h4>
                <p className="text-sm">
                  No credentials configured for {data.application}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="ml-auto"
            >
              Delete Node
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Trash
        className="absolute w-3 h-3 -top-2 bg-neutral-100 text-black rounded-full right-4 cursor-pointer p-0.5"
        onClick={handleDelete}
      />

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-300 border-2 border-orange-500"
      />

      <div className="p-4 text-center">
        <div className="flex flex-col justify-center items-center ">
          <div>{actionIcon}</div>
          <div className="text-white text-sm font-medium mt-2">
            {displayName}
          </div>
        </div>

        {/* status indicators */}
        {data.credentials ? (
          <div className="text-green-200 text-xs mt-1">✓ Configured</div>
        ) : (
          <div className="text-yellow-200 text-xs mt-1"> Needs credentials</div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-300 border-2 border-green-500"
      />
    </div>
  );
}
