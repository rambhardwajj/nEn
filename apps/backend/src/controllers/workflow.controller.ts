import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { WorkflowSchema } from "../utils/workflowSchema";

export const saveWorkflow = asyncHandler(async (req, res) => {
  const payload = req.body;
  console.log("Nodes ", payload.nodes)
  const parsed = WorkflowSchema.parse(payload)
  console.log(parsed)
  res.status(200).json(new ApiResponse(200, "fda", parsed));
});
