import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import cors from "cors";
const app = express();

app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

import authRouter from "./routes/auth.routes";
import credRouter from "./routes/cred.routes";
import triggerRouter from "./routes/triggers.routes"
import workflowRouter from "./routes/workflow.routes"
import webHookRouter from "./routes/webhook.routes"
import { errorHandler } from "./middlewares/error.middleware";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cred", credRouter);
app.use("/api/v1/trigger", triggerRouter)
app.use('/api/v1/workflow',workflowRouter )
app.use('/api/v1/webhook', webHookRouter )

app.listen(8888, () => {
  console.log("app is listening on port ", 8888);
});

app.use(errorHandler);
