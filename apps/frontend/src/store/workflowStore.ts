import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  type Node, 
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect
} from "@xyflow/react";
import type { UserCredentials } from "@repo/db";
import axios from 'axios';

export interface TriggerI {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export interface WorkflowState {
  // Core workflow data
  nodes: Node[];
  edges: Edge[];
  workflowId?: string; // Add workflow ID for tracking
  
  // UI state
  isWorkflowActive: boolean;
  projectName: string;
  
  // Data
  triggers: TriggerI[];
  userCredentials: UserCredentials[];
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  
  // Actions for nodes and edges
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  // Actions for workflow management 
  setIsWorkflowActive: (active: boolean) => void;
  setProjectName: (name: string) => void;
  resetWorkflow: () => void; // Reset to initial state
  
  // Actions for triggers
  setTriggers: (triggers: TriggerI[]) => void;
  addTriggerNode: (trigger: TriggerI) => void;
  
  // Actions for credentials
  setUserCredentials: (credentials: UserCredentials[]) => void;
  
  // Async actions
  saveWorkflow: (workflowId?: string) => Promise<string | null>; // Return workflow ID
  loadWorkflow: (workflowId: string) => Promise<void>; // Load specific workflow
  loadTriggers: () => Promise<void>;
  loadUserCredentials: () => Promise<void>;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addActionNode: (actionData: any) => void;
}

const initialNodes: Node[] = [
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

export const useWorkflowStore = create<WorkflowState>()(
  devtools(
    (set, get) => ({
      nodes: initialNodes,
      edges: [],
      workflowId: undefined,
      isWorkflowActive: false,
      projectName: "My Workflow Project",
      triggers: [],
      userCredentials: [],
      isLoading: false,
      isSaving: false,

      // Node and edge handlers
      onNodesChange: (changes) => {
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes)
        }));
      },
      onEdgesChange: (changes) => {
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges)
        }));
      },
      onConnect: (connection) => {
        set((state) => ({
          edges: addEdge(connection, state.edges)
        }));
      },

      setIsWorkflowActive: (active) => {
        set({ isWorkflowActive: active });
      },
      setProjectName: (name) => {
        set({ projectName: name });
      },
      resetWorkflow: () => {
        set({
          nodes: initialNodes,
          edges: [],
          workflowId: undefined,
          isWorkflowActive: false,
          projectName: "My Workflow Project",
        });
      },

      setTriggers: (triggers) => {
        set({ triggers });
        
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === "1"
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    triggers,
                    onSelectTrigger: get().addTriggerNode,
                  },
                }
              : node
          )
        }));
      },
      addTriggerNode: (trigger) => {
        const { nodes } = get();
        
        const newNode: Node = {
          id: `trigger-${nodes.length}`,
          type: getNodeType(trigger.type),
          position: { x: 0 + nodes.length * 150, y: 10 },
          data: {
            label: trigger.name,
            description: trigger.description,
            triggerType: trigger.type,
            triggerId: trigger.id,
          },
        };
        
        const newNodes = nodes.filter((node) => node.id !== "1")
        set(() => ({
          nodes: [...newNodes, newNode]
        }));
      },

      // Credentials management
      setUserCredentials: (credentials) => {
        set({ userCredentials: credentials });
      },

      // Action node management
      addActionNode: (actionData) => {
        const { nodes } = get();
        
        const newNode: Node = {
          id: `action-${nodes.length}`,
          type: "action", 
          position: { x: 0 + nodes.length * 150, y: 200 },
          data: {
            label: actionData.name || "Action",
            actionType: actionData.type,
            application: actionData.application,
            credentials: actionData.credentials,
            metadata: actionData.metadata,
            ...actionData,
          },
        };

        set((state) => ({
          nodes: [...state.nodes, newNode]
        }));
      },

      saveWorkflow: async (workflowId?: string) => {
        const { nodes, edges, projectName, isWorkflowActive } = get();
        
        set({ isSaving: true });
        
        try {
          const workflow = {
            nodes,
            edges,
            name: projectName,
            active: isWorkflowActive,
          };

          let res;
          if (workflowId) {
            console.log("in update ")
            res = await axios.put(
              `http://localhost:8888/api/v1/workflow/${workflowId}`,
              workflow,
              { withCredentials: true }
            );
          } else {
            console.log("in create")
            res = await axios.post(
              "http://localhost:8888/api/v1/workflow/save",
              workflow,
              { withCredentials: true }
            );

            console.log(res)
          }

          if (res && res.data) {
            const savedWorkflowId = res.data.workflowId || res.data.data?.workflowId;
            console.log(savedWorkflowId)
            set({ workflowId: savedWorkflowId });
            alert("Workflow saved successfully!");
            return savedWorkflowId;
          }
        } catch (error) {
          console.error("Failed to save workflow:", error);
          alert("Failed to save workflow");
          return null;
        } finally {
          set({ isSaving: false });
        }
        return null;
      },

      loadWorkflow: async (workflowId: string) => {
        set({ isLoading: true });
        
        try {
          const res = await axios.get(
            `http://localhost:8888/api/v1/workflow/${workflowId}`,
            { withCredentials: true }
          );
          
          if (res.data && res.data.data) {
            const workflow = res.data.data;
            set({
              workflowId: workflowId,
              nodes: workflow.nodes || initialNodes,
              edges: workflow.edges || [],
              projectName: workflow.name || "Loaded Workflow",
              isWorkflowActive: workflow.active || false,
            });
          }
        } catch (error) {
          console.error("Failed to load workflow:", error);
          alert("Failed to load workflow");
        } finally {
          set({ isLoading: false });
        }
      },

      loadTriggers: async () => {
        set({ isLoading: true });
        
        try {
          const res = await axios.get(
            "http://localhost:8888/api/v1/trigger/all",
            { withCredentials: true }
          );
          
          get().setTriggers(res.data.data);
        } catch (error) {
          console.error("Failed to load triggers:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      loadUserCredentials: async () => {
        try {
          const res = await axios.get(
            'http://localhost:8888/api/v1/cred/all',
            { withCredentials: true }
          );
          
          get().setUserCredentials(res.data.data);
        } catch (error) {
          console.error("Failed to load user credentials:", error);
        }
      },
    }),
    {
      name: 'workflow-store', 
    }
  )
);