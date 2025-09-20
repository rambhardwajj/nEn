import { createClient } from "redis";
import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map<string, WebSocket[]>();

wss.on("connection", (ws, req) => {
  const url = new URL(req.url!, "http://localhost");
  const executionId = url.pathname.split("/").pop()!;

  if (!clients.has(executionId)) clients.set(executionId, []);

  clients.get(executionId)!.push(ws);

  ws.on("close", () => {
    clients.set(
      executionId,
      (clients.get(executionId) ?? []).filter((c) => c !== ws)
    );
  });
});

const subscriberRedis = createClient({ url: "redis://localhost:6379" });

const connectRedis = async () => {
  try {
    await subscriberRedis.connect();
    console.log("Redis connected ");
  } catch (error) {
    console.log("error ", error);
  }
};
connectRedis();

subscriberRedis.on("error", (err) => {
  console.error("Redis error:", err);
});

const main = async () => {
  console.log("BE queueWorker")

  await subscriberRedis.subscribe("workflow.event", (msg) => {
    console.log("event ", JSON.parse(msg));
    const event = JSON.parse(msg);
    const { executionId } = event;

    if (clients.has(executionId)) {
      for (const ws of clients.get(executionId)!) {
        ws.send(JSON.stringify(event));
      }
    }
    
  });
};

main();
