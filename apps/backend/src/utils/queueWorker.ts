import { createClient } from "redis";
import WebSocket, { WebSocketServer }  from "ws";

const wss = new WebSocketServer({port: 8080})

wss.on('connection', (ws, req) =>{
   
})

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

const main = async () => {
  console.log("BE queueWorker");
  await subscriberRedis.subscribe("workflow.event", (msg) => {
     console.log("event ", JSON.parse(msg));
  });
};

main();
