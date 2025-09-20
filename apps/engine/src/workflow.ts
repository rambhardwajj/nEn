import { type NodeData, type WorkflowExecutionData } from "./types";
import { EventPublisher } from "./EventPublisher";

export class Workflow {
  private executionData: WorkflowExecutionData;
  private adjacencyList: Map<string, string[]>;
  private inDegree: Map<string, number>;
  private nodes: Map<string, NodeData>;
  private eventPublisher = new EventPublisher();

  constructor(executionData: WorkflowExecutionData) {
    this.executionData = executionData;
    this.adjacencyList = new Map<string, string[]>();
    this.inDegree = new Map<string, number>();
    this.nodes = new Map<string, NodeData>();
  }

  buildGraph() {
    this.executionData.workflow.nodes.map((node) => {
      this.nodes.set(node.id, node);
      this.adjacencyList.set(node.id, []);
      this.inDegree.set(node.id, 0);
    });
    this.executionData.workflow.edges.forEach((edge) => {
      this.adjacencyList.get(edge.source)?.push(edge.target);
      this.inDegree.set(edge.target, (this.inDegree.get(edge.target) ?? 0) + 1);
    });
  }
  detectCycle(): boolean {
    const tempInDegree = new Map(this.inDegree);
    const queue: string[] = [];
    const processed: string[] = [];

    for (let [nodeId, degree] of tempInDegree) {
      if (degree === 0) queue.push(nodeId);
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      processed.push(current);

      for (let dependent of this.adjacencyList.get(current) ?? []) {
        tempInDegree.set(dependent, (tempInDegree.get(dependent) ?? 0) - 1);
        if (tempInDegree.get(dependent) === 0) queue.push(dependent);
      }
    }

    return processed.length !== this.nodes.size;
  }
  getExecutionOrder(): string[] {
    const tempInDegree = new Map(this.inDegree);

    const queue: string[] = [];
    const order: string[] = [];

    for (let [nodeId, degree] of tempInDegree) {
      if (degree === 0) queue.push(nodeId);
    }
    while (queue.length > 0) {
      const currNodeId = queue.shift()!;
      order.push(currNodeId);

      for (let neighbour of this.adjacencyList.get(currNodeId) ?? []) {
        tempInDegree.set(neighbour, (tempInDegree.get(neighbour) ?? 0) - 1);
        if (tempInDegree.get(neighbour) === 0) {
          queue.push(neighbour);
        }
      }
    }
    if (order.length !== this.nodes.size) {
      console.log("the graph is Cyclic,");
    }
    return order;
  }

  async executeNode(nodeId: string): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      console.log("node not found ");
      return;
    }

    console.log(`Executing node ${node.id} of type ${node.type}`);

    console.log("--->>>>>>",this.executionData.executionId)

    this.eventPublisher.publish("workflow.event", {
      executionId: this.executionData.executionId,
      workflow: this.executionData.workflow.id,
      nodeId: node.id,
      timeStamp: new Date(Date.now()),
      status: "started",
    });

    console.log(node);
    try {
      if (node.type === "manualTrigger") {
        console.log(node);
        this.eventPublisher.publish("workflow.event", {
          executionId: this.executionData.executionId,
          workflow: this.executionData.workflow.id,
          nodeId: node.id,
          timeStamp: new Date(Date.now()),
          status: "completed",
        });
        console.log("manual trigger notif sent ");
      } else if (node.type === "action") {

        // STIMULATIOM for an action
        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.eventPublisher.publish("workflow.event", {
          executionId: this.executionData.executionId,
          workflow: this.executionData.workflow.id,
          nodeId: node.id,
          timeStamp: new Date(Date.now()),
          status: "completed",
        });
        console.log("action trigger sent ");
      }
    } catch (error: any) {
      console.log("error in event ");
      this.eventPublisher.publish("workflow.event", {
        executionId: this.executionData.executionId,
        workflow: this.executionData.workflow.id,
        nodeId: node.id,
        timeStamp: new Date(Date.now()),
        status: "failed",
        data: { message: error.message },
      });
    }
  }
  async execute(): Promise<void> {
    this.buildGraph();

    if (this.detectCycle()) {
      console.log("Workflow contains cycles");
    }

    const executionOrder = this.getExecutionOrder();
    console.log(executionOrder);

    for (let nodeId of executionOrder) {
      console.log(nodeId);
      await this.executeNode(nodeId);
    }
  }

}
