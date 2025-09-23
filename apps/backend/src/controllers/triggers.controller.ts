import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "@repo/db";
import { CustomError } from "../utils/CustomError";

const wbId = new Set();

export const getAllTriggers = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) throw new CustomError(400, "user does not exits");

  const allTriggers = await prisma.availabeTriggers.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
    },
  });
  if (!allTriggers) {
    throw new CustomError(400, "No triggers found");
  }
  res.status(200).json(new ApiResponse(200, "triggers returned", allTriggers));
});

export const createTrigger = asyncHandler(async (req, res) => {
  const { name, type, description } = req.body;

  if (!name || !type || !description) {
    res
      .status(403)
      .json(
        new ApiResponse(200, "Some properties does not exits", {
          name,
          type,
          description,
        })
      );
    return;
  }

  const newTrigger = await prisma.availabeTriggers.create({
    data: {
      name,
      type,
      description,
    },
  });

  res.status(200).json(new ApiResponse(200, "new trigger created", newTrigger));
});

