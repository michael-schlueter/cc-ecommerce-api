import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { addRefreshTokenToWhitelist } from "../services/auth.services";
import {
  createUser,
  editUser,
  findUserByEmail,
  findUserById,
  findUsers,
  removeUser,
  validateEmail,
  validatePassword,
} from "../services/users.services";
const { v4: uuidv4 } = require("uuid");
import { generateTokens } from "../utils/jwt";
const bcrypt = require("bcrypt");

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

// @desc Login user
// @desc POST /api/users/login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send({
        message: "You must provide an email and a password",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      return res.status(401).send({
        message: "Invalid login credentials",
      });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return res.status(401).send({
        message: "Invalid login credentials",
      });
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: existingUser.id,
    });

    return res.status(201).send({
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

// @desc Update specific user
// @route /api/users/id
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, password, firstName, lastName } = req.body;

  try {
    if (
      email === "" ||
      email == null ||
      password === "" ||
      password == null ||
      firstName === "" ||
      firstName == null ||
      lastName === "" ||
      lastName == null
    ) {
      return res.status(400).send({
        message:
          "User data is missing (email, password, first and last name are required",
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

    // Check if the user who is updating user information is the user him/herself
    const user = await findUserById(req.payload!.userId);
    const userToUpdate = await findUserById(parseInt(id));

    if (req.payload!.userId !== userToUpdate?.id) {
      return res.status(403).send({
        message: "Not authorized to update user information",
      });
    }

    if (userToUpdate?.email !== email) {
      if ((await findUserByEmail(email)) !== null) {
        return res.status(400).send({
          message: "Email already in use by another user",
        });
      }
    }

    const updatedUser = await editUser(
      parseInt(id),
      email,
      password,
      firstName,
      lastName
    );

    if (!updatedUser) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    return res.status(200).send(updatedUser);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

// @desc Delete specific user
// @route DELETE /api/users/id
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userToDelete = await findUserById(parseInt(id));

    if (!userToDelete) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    if (req.payload?.userId !== userToDelete.id) {
      return res.status(403).send({
        message: "Not authorized to delete user",
      });
    }

    await removeUser(parseInt(id));

    return res.sendStatus(204);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
