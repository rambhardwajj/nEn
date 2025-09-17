import { Router } from "express";
import { saveWorkflow } from "../controllers/workflow.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";

const router  = Router();

router.post('/save',isLoggedIn, saveWorkflow)

export default router