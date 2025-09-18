import { Router } from "express";
import { 
  saveWorkflow, 
  getWorkflowById, 
  updateWorkflow, 
  getUserWorkflows, 
  executeFlow
} from "../controllers/workflow.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";

const router = Router();

router.post('/save', isLoggedIn, saveWorkflow);
router.get('/:workflowId', isLoggedIn, getWorkflowById);
router.put('/:workflowId', isLoggedIn, updateWorkflow);
router.get('/', isLoggedIn, getUserWorkflows);
router.get('/execute/:workflowId', isLoggedIn, executeFlow)

export default router;