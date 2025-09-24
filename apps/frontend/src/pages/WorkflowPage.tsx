import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ReactFlow,
  type FitViewOptions,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  Controls,
  Background,
  MiniMap,
  ControlButton,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AddTrigger } from "@/components/AddTrigger";
import { ManualTriggerNode } from "@/components/nodeComponents/ManualTriggerNode";
import { ScheduledTriggerNode } from "@/components/nodeComponents/ScheduleTrigger";
import { WebhookTriggerNode } from "@/components/nodeComponents/WebhookTrigger";
import { WorkflowNavbar } from "@/components/WorkflowNavbar";
import { useWorkflowStore } from "@/store/workflowStore";
import { Loader2 } from "lucide-react";
import { ActionNode } from "@/components/nodeComponents/ActionNode";

// ye  Node configuration
const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};
const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};
const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log("drag event", node.data);
};
const nodeTypes = {
  addTrigger: AddTrigger,
  manualTrigger: ManualTriggerNode,
  scheduleTrigger: ScheduledTriggerNode,
  webhookTrigger: WebhookTriggerNode,
  action: ActionNode,
};

const WorkflowPage = () => {
  const { workflowId } = useParams();

  const {
    nodes,
    edges,

    nodeStatuses,
    isExecuting,
    executionEvents,

    isWorkflowActive,
    projectName,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveWorkflow,
    setIsWorkflowActive,
    loadWorkflow,
    loadUserCredentials,
    isSaving,
    isLoading,
  } = useWorkflowStore();

  const nodesWithStatus = nodes.map((node) => {
    const status = nodeStatuses.get(node.id) || "idle";

    let style = { ...node.style };
    switch (status) {
      case "running":
        style = {
          ...style,
          borderColor: "#FFA500",
          border: "2px solid #FF8C00",
          borderRadius: "10px",

          boxShadow: "0 0 10px rgba(255, 165, 0, 0.5)",
        };
        break;
      case "completed":
        style = {
          ...style,
          padding: "10px",
          backgroundColor: "#3CB371",
          borderRadius: "10px",
          // border: "2px solid #45a049",
          color: "white",
        };
        break;
      case "failed":
        style = {
          ...style,
          borderRadius: "10px",

          backgroundColor: "#F44336",
          // border: "2px solid #da190b",
          color: "white",
        };
        break;
      default:
        style = {
          ...style,
          backgroundColor: "#FFFFFF",
          // border: "1px solid #ddd",
        };
    }

    return { ...node, style };
  });

  useEffect(() => {
    if (workflowId) {
      // loading  the specific workflow when component aata h
      loadWorkflow(workflowId);
      loadUserCredentials();
    }
  }, [workflowId, loadWorkflow]);

  const handleSave = async () => {
    try {
      await saveWorkflow(workflowId); // pass workflowId for updating
    } catch (error) {
      console.error("Error saving workflow:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[100vh] w-[100vw] flex items-center justify-center">
        <div className="text-lg">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className="h-[100vh] w-[100vw] relative">
      {isExecuting && (
        <div className="absolute top-20 right-4 z-50 bg-orange-100 border border-orange-300 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
            <span className="text-orange-800 font-medium">
              Executing Workflow...
            </span>
          </div>
        </div>
      )}
      <WorkflowNavbar
        projectName={projectName}
        isActive={isWorkflowActive}
        onSave={handleSave}
        onActiveToggle={setIsWorkflowActive}
        isSaving={isSaving}
        isViewMode={true}
      />
      <ReactFlow
        className=""
        nodes={nodesWithStatus}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Controls>
          <ControlButton
            onClick={() => alert("Something magical just happened")}
          />
        </Controls>
        <Background />
        <MiniMap nodeStrokeWidth={3} />
      </ReactFlow>

      {executionEvents.length > 0 && (
        <div className="absolute bottom-4 left-4 max-w-sm bg-white border rounded-lg shadow-lg p-4 max-h-40 overflow-y-auto">
          <h4 className="font-medium mb-2">Execution Log:</h4>
          {executionEvents.slice(-5).map((event, index) => (
            <div key={index} className="text-xs text-gray-600 mb-1">
              <span
                className={`font-medium ${
                  event.status === "started"
                    ? "text-orange-600"
                    : event.status === "completed"
                      ? "text-green-600"
                      : "text-red-600"
                }`}
              >
                {event.status.toUpperCase()}
              </span>
              : {event.nodeId}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowPage;
