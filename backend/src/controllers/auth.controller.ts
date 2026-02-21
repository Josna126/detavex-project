import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { prisma } from "../db/prisma";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const signToken = (userId: string): string =>
  jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  });

export const signup = async (req: Request, res: Response): Promise<void> => {
  const parsed = signupSchema.parse(req.body);
  const email = parsed.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw createHttpError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.name.trim(),
      email,
      passwordHash
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  const token = signToken(user.id);
  res.status(201).json({
    message: "Successfully signed up",
    token,
    user
  });
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const parsed = signinSchema.parse(req.body);
  const email = parsed.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  const validPassword = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!validPassword) {
    throw createHttpError(401, "Invalid email or password");
  }

  const token = signToken(user.id);
  res.status(200).json({
    message: "Successfully signed in",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw createHttpError(401, "Unauthorized");
  }
  res.status(200).json({ user: req.user });
};

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  res.status(200).json({ users });
};
