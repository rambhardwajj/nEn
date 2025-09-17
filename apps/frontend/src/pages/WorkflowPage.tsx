import { useEffect } from "react";
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
import { useWorkflowStore } from "@/store/workflowStore"; // Adjust path as needed

// Node configuration
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
};

const WorkflowPage = () => {
  // Get all needed state and actions from Zustand store
  const {
    nodes,
    edges,
    isWorkflowActive,
    projectName,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveWorkflow,
    setIsWorkflowActive,
    loadTriggers,
    loadUserCredentials,
    isSaving,
  } = useWorkflowStore();

  useEffect(() => {
    loadTriggers();
    loadUserCredentials();
  }, [loadTriggers, loadUserCredentials]);

  return (
    <div className="h-[100vh] w-[100vw] relative">
      <WorkflowNavbar
        projectName={projectName}
        isActive={isWorkflowActive}
        onSave={saveWorkflow}
        onActiveToggle={setIsWorkflowActive}
        isSaving={isSaving}
      />
      <ReactFlow
        className=""
        nodes={nodes}
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
    </div>
  );
};

export default WorkflowPage;