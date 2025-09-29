import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { CreateWorkflowNavbar } from "@/components/CreateWorkflowNavbar";
import { useWorkflowStore } from "@/store/workflowStore";

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

const CreateWorkflowPage = () => {
  const navigate = useNavigate();
  
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
    resetWorkflow, 
  } = useWorkflowStore();

  useEffect(() => {
    resetWorkflow();
    loadTriggers();
    loadUserCredentials();
  }, [resetWorkflow, loadTriggers, loadUserCredentials]);

  const handleSave = async () => {
    try {
      const workflowId = await saveWorkflow(); 
      if (workflowId) {
        navigate(`/workflow/${workflowId}`);
      }
    } catch (error) {
      console.error("Error saving workflow:", error);
    }
  };

  return (
    <div className="h-[90vh] w-[100vw] relative">
      <CreateWorkflowNavbar
        projectName={projectName}
        isActive={isWorkflowActive}
        onSave={handleSave}
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

export default CreateWorkflowPage;