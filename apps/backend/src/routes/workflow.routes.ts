import { Router } from "express";
import { saveWorkflow } from "../controllers/workflow.controller";

const router  = Router();

router.get('/save', saveWorkflow)

export default router