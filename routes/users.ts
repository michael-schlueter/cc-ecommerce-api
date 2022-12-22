import express from "express";

import {
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
} from "../controller/users";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);

module.exports = userRouter;
