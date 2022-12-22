import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { findUserById, findUsers } from "../services/users.services";

const prisma = new PrismaClient();

// @desc Get all users
// @route GET /api/users
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

// @desc Get specific user by id
// @route GET /api/users/id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await findUserById(parseInt(id));

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    return res.status(200).send(user);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
