import { Request, Response } from "express";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
  revokeTokens,
} from "../services/auth.services";
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
import { hashToken } from "../utils/hashToken";
import { generateTokens } from "../utils/jwt";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const userId = parseInt(id);

  try {
    if (Number.isNaN(userId)) {
      return res.status(400).send({
        message: "Expected userId to be a number"
      })
    }
    const user = await findUserById(userId);

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
  const userId = parseInt(id);
  const { email, password } = req.body;

  try {
    if (
      email === "" ||
      email == null ||
      password === "" ||
      password == null
    ) {
      return res.status(400).send({
        message:
          "Email or password is missing",
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
    if (Number.isNaN(userId)) {
      return res.status(400).send({
        message: "Expected userId to be a number"
      })
    }
    const userToUpdate = await findUserById(userId);

    if (!userToUpdate) {
      return res.status(404).send({
        message: "User not found",
      });
    }

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
      userId,
      email,
      password,
    );

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
  const userId = parseInt(id);

  try {
    if (Number.isNaN(userId)) {
      return res.status(400).send({
        message: "Expected userId to be a number"
      })
    }
    const userToDelete = await findUserById(userId);

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

    await removeUser(userId);

    return res.sendStatus(204);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

// @desc Validate and delete/renew refresh token
// @route POST /api/users/refreshToken
export const validateRefreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken) {
      return res.status(400).send("Missing refresh token");
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      return res.status(401).send("Unauthorized");
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      return res.status(401).send("Unauthorized");
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user,
      jti
    );
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    return res.status(201).send({ accessToken, refreshToken: newRefreshToken });
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

// @desc Revoke refresh token for a specific user
// @route POST /api/users/id
// ADMIN ROUTE
// export const revokeRefreshTokens = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.body;

//     const user = findUserById(userId);
//     if (!user) {
//       return res.status(404).send({
//         message: "User not found"
//       })
//     }

//     await revokeTokens(userId);
//     return res.status(201).send({
//       message: `Tokens revoked for user with id ${userId}`
//     })
//   } catch (err: any) {
//     res.status(500).send({
//       message: err.message
//     })
//   }
// }
