import { Router } from "express";
import { 
  saveWorkflow, 
  getWorkflowById, 
  updateWorkflow, 
  getUserWorkflows, 
  executeFlow,
  deleteWorkflow
} from "../controllers/workflow.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";

const router = Router();

router.post('/save', isLoggedIn, saveWorkflow);
router.get('/:workflowId', isLoggedIn, getWorkflowById);
router.put('/:workflowId', isLoggedIn, updateWorkflow);
router.get('/', isLoggedIn, getUserWorkflows);
router.post('/execute/:workflowId', isLoggedIn, executeFlow)
router.post('/getAllWorkflows', isLoggedIn, getUserWorkflows)
router.delete('/:workflowId', isLoggedIn, deleteWorkflow)
export default router;
