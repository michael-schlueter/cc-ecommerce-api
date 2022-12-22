import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { findUsers } from "../services/users.services";

const prisma = new PrismaClient();

// @desc GET all users
// @route /api/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await findUsers();

    if (users.length < 1) {
      return res.status(404).send({
        message: "No users found",
      });
    }

    return res.status(200).send(users);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
