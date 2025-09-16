import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  Controls,
  Background,
  MiniMap,
  ControlButton,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from "axios";
import { AddTrigger } from "@/components/AddTrigger";
import { ManualTriggerNode } from "@/components/nodeComponents/ManualTriggerNode";
import { ScheduledTriggerNode } from "@/components/nodeComponents/ScheduleTrigger";
import { WebhookTriggerNode } from "@/components/nodeComponents/WebhookTrigger";
import { WorkflowNavbar } from "@/components/WorkflowNavbar";

interface TriggerI {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export type AddTriggerNodeData = {
  label: string;
  triggers?: TriggerI[];
  onSelectTrigger?: (trigger: TriggerI) => void;
};

// ---------NODES-CONFIG-------------------------
const initialNodes: Node<AddTriggerNodeData>[] = [
  {
    id: "1",
    type: "addTrigger",
    data: {
      label: "Add Trigger",
      triggers: [],
    },
    position: { x: 0, y: 50 },
  },
];
const initialEdges: Edge[] = [];
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
//--------------------------------------------------

//----------Workflow-------------------------
const WorkflowPage = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [triggers, setTriggers] = useState<TriggerI[]>();
  const [isWorkflowActive, setIsWorkflowActive] = useState(false);
  const [projectName, setProjectName] = useState("My Workflow Project");

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleSave = useCallback(async () => {
    try {
      const workflow = {
        nodes: nodes,
        edges: edges,
        name: projectName,
        active: isWorkflowActive,
      };
      console.log("Saving workflow:", workflow);

      const res = await axios.post(
        "http://localhost:8888/api/v1/workflow/save",
        workflow,
        {
          withCredentials: true,
        }
      );

      if (res) {
        alert("Workflow saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save workflow:", error);
      alert("Failed to save workflow");
    }
  }, [nodes, edges, projectName, isWorkflowActive]);
  const handleActiveToggle = useCallback((active: boolean) => {
    setIsWorkflowActive(active);
    console.log("Workflow active status:", active);
  }, []);
  const handleSelectTrigger = useCallback((trigger: TriggerI) => {
    console.log("trigger -> ", trigger);

    setNodes((prevNodes) => {
      const getNodeType = (triggerType: string) => {
        switch (triggerType?.toLowerCase()) {
          case "manual":
            return "manualTrigger";
          case "webhook":
            return "webhookTrigger";
          case "schedule":
            return "scheduleTrigger";
          default:
            return "default";
        }
      };
      const newNode: Node = {
        id: `trigger-${prevNodes.length}`,
        type: getNodeType(trigger.type),
        position: { x: 200 + prevNodes.length * 150, y: 100 },
        data: {
          label: trigger.name,
          description: trigger.description,
          triggerType: trigger.type,
          triggerId: trigger.id,
        },
      };
      return [...prevNodes, newNode];
    });
  }, []);
  useEffect(() => {
    const getAvailableTriggers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8888/api/v1/trigger/all",
          {
            withCredentials: true,
          }
        );

        console.log(res.data.data);
        setTriggers(res.data.data);

        setNodes((nds) =>
          nds.map((node) =>
            node.id === "1" // Adding the triggers and callback function to 1st Node
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    triggers: res.data.data, // this helps  trigger Sheet Node to display triggers in sheet
                    onSelectTrigger: handleSelectTrigger, // this callback helps the sheet comp to run the handleSelectTrigger function to create a new Node
                  },
                }
              : node
          )
        );
      } catch (error) {
        console.error("Failed to load triggers:", error);
      }
    };
    getAvailableTriggers();
  }, [handleSelectTrigger]);

  return (
    <div className="h-[100vh] w-[100vw] ">
      <WorkflowNavbar
        projectName={projectName}
        isActive={isWorkflowActive}
        onSave={handleSave}
        onActiveToggle={handleActiveToggle}
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
          ></ControlButton>
        </Controls>
        <Background />
        <MiniMap nodeStrokeWidth={3} />
      </ReactFlow>
    </div>
  );
};

export default WorkflowPage;
