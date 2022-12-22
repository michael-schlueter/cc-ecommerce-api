import express from "express";

import {
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
} from "../controller/users";
import { checkAuthentication } from "../middleware";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/:id", checkAuthentication, updateUser);

module.exports = userRouter;
