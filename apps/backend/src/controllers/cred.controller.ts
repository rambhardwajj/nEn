import asyncHandler from "../utils/asyncHandler";
import fs from "fs";
import path from "path";
import { ApiResponse } from "../utils/ApiResponse";
import { returnSaveCred } from "../utils/handleSaveCred";
import { prisma } from "@repo/db";
import z from "zod";
import { CustomError } from "../utils/CustomError";

const createCredentialsSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  appIcon: z.string().optional(),
  apiName: z.string().optional(),
  data: z.object({
    accessToken: z.string().optional(),
    baseUrl: z.string().optional(),
    apiKey: z.string().optional(),
    organizationId: z.string().optional(),
    url: z.string().optional(),
    allowedHttpRequestDomains: z.string().optional(),
    allowedDomains: z.string().optional(),
  }),
});

export const getCredentialApis = asyncHandler(async (req, res) => {
  const credFilePath = path.join(process.cwd(), "src", "credentials.json");
  console.log(credFilePath);
  const fileData = fs.readFileSync(credFilePath, "utf-8");
  console.log(fileData);
  const data = JSON.parse(fileData);

  res.status(200).json(new ApiResponse(200, "path", data));
});

export const createCredentials = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  // console.log(req.body)
  const credData = createCredentialsSchema.safeParse(req.body);
  // console.log("redData-> ", credData);

  if (!credData.data) throw new CustomError(403, "zod error in creting cred");
  const createdCred = await prisma.userCredentials.create({
    data: {
      name: credData.data!.name,
      apiName: credData.data.apiName,
      appIcon: credData.data.appIcon,
      userId: userId,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      data: credData.data.data,
    },
  });
  // console.log(createdCred);

  res
    .status(200)
    .json(
      new ApiResponse(200, "credentials created successfully", createdCred)
    );
});

const updateCredentialsSchema = z.object({
  name: z.string().optional(),
  type: z.string().nullable().optional(),
  appIcon: z.string().optional(),
  apiName: z.string().optional(),
  data: z
    .object({
      accessToken: z.string().optional(),
      baseUrl: z.string().optional(),
      apiKey: z.string().optional(),
      organizationId: z.string().optional(),
      url: z.string().optional(),
      allowedHttpRequestDomains: z.string().optional(),
      allowedDomains: z.string().optional(),
    })
    .partial()
    .optional(),
});

export const updateCredential = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  console.log(req.body)
  const credData = updateCredentialsSchema.safeParse(req.body);
  const { credId } = req.params;
  if(credData.error){
    throw new CustomError(403, "updated cred failed due to input validation")
  }

  const existingCred = await prisma.userCredentials.findFirst({
    where: {
      id: credId,
      userId: userId,
    },
  });
  if (!existingCred)
    throw new CustomError(401, "Credentials does not belogns to you");

   const updatedCred = await prisma.userCredentials.update({
    where: { id: credId },
    data: {
      name: existingCred.name,
      type: existingCred.type,
      appIcon:  existingCred.appIcon,
      apiName:  existingCred.apiName,
      data: credData.data && credData.data.data
        ? { ...(existingCred.data as any), ...credData.data.data }
        : existingCred.data,
      updatedAt: new Date(),
    },
  });
  res.status(200).json(new ApiResponse(200, "updated successfuly ", updatedCred))
});

export const getAllCredentials = asyncHandler(async ( req, res) =>{
  const userId = req.user.id;
  if( !userId) throw new CustomError(404, "User id is invalid")

  const allUserCred = await prisma.userCredentials.findMany({
    where: {
      userId : userId
    }
  })

  console.log(allUserCred);

  res.status(200).json(new ApiResponse(200, "Retrieved all the credentionls for the user",allUserCred ))
})