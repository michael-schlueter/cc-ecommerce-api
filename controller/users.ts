import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { addRefreshTokenToWhitelist } from "../services/auth.services";
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUsers,
  validateEmail,
  validatePassword,
} from "../services/users.services";
const { v4: uuidv4 } = require("uuid");
import { generateTokens } from "../utils/jwt";

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

// @desc Create an user
// @route POST /api/users
export const registerUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send({
        message: "You must provide an email and a password",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).send({
        message: "Email already in use",
      });
    }

    const validEmail = validateEmail(email);
    if (!validEmail) {
      return res.status(400).send({
        message: "Please enter a valid email address",
      });
    }

    const validPassword = validatePassword(password);
    if (!validPassword) {
      return res.status(400).send({
        message:
          "Password has to have at minimum 8 characters with one lowercase letter, one uppercase letter, one number and one special character",
      });
    }

    const user = await createUser({ email, password, firstName, lastName });
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    return res.status(201).send({ accessToken, refreshToken });
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
