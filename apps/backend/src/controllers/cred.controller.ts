import asyncHandler from "../utils/asyncHandler";
import fs from "fs"
import path from "path";
import { ApiResponse } from "../utils/ApiResponse";

export const getCredentialApis =  asyncHandler(async(req, res) =>{
    const credFilePath = path.join(
    process.cwd(),
    "src",
    "credentials.json",
  );
  console.log(credFilePath)
  const fileData = await fs.readFileSync(credFilePath, "utf-8");
  console.log(fileData)
  const data = JSON.parse(fileData)

  res.status(200).json(new ApiResponse(200, "path", data))
})  