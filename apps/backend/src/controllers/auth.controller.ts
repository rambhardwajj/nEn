import { prisma } from "@repo/db";
import type { Request, RequestHandler, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CustomError } from "../utils/CustomError";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import ms, { type StringValue } from "ms";
import bcrypt from "bcryptjs";
import { generateCookieOptions } from "../config/cookie";

export const createHash = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const passwordMatch = async (
  enteredPassword: string,
  storedPassword: string
) => bcrypt.compare(enteredPassword, storedPassword);

export const generateAccessToken = (user: any) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as StringValue }
  );

export const generateRefreshToken = (user: any) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as StringValue }
  );

export const signup: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // console.log(email, password);

    let existingUser;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    existingUser = user;
    if (existingUser) throw new CustomError(400, "User already exists");

    const newUser = await prisma.user.create({
      data: {
        email: email,
        passwordHash: password,
        lastLoggedId: new Date(),
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, "User created successfully", newUser.id));
  }
);

export const signin: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("user not found in signin");
    throw new CustomError(400, "Invalid email or password");
  }
  const isPasswordValid = password === user.passwordHash;
  if (!isPasswordValid) {
    console.log("password is invalid");
    throw new CustomError(400, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const hashedRefreshToken = createHash(refreshToken);
  const expiresAt = new Date(
    Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRY as StringValue)
  );
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { refreshToken: hashedRefreshToken, refreshTokenExpiry: expiresAt },
  });

  // console.log(accessToken)

  res
    .status(200)
    .cookie("accessToken", accessToken, generateCookieOptions())
    .cookie("refreshToken", refreshToken, generateCookieOptions())
    .json(new ApiResponse(200, "Login successful", updatedUser));
});

export const signout: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) throw new CustomError(401, "Not authorized");

  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken: null,
      refreshTokenExpiry: null,
    },
  });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json(new ApiResponse(200, "Signout successful", null));
});

export const getUser: RequestHandler = asyncHandler(
  async (req: Request, res) => {
    const userId = req.user.id;
    if (!userId) throw new CustomError(400, "user not found ");

    try {
      const user = await prisma.user.findFirst({
        where: { id: req.user.id },
      });

      if (!user) throw new CustomError(404, "User not found");

      res.status(200).json(new ApiResponse(200, "User fetched", user));
    } catch (error) {
      throw new CustomError(401, "User can be fetched");
    }
  }
);

