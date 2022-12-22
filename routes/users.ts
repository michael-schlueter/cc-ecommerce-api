import express from "express";

import { getAllUsers, getUserById } from "../controller/users";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);

module.exports = userRouter;