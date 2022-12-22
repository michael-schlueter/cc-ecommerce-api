import express from "express";

import { getAllUsers, getUserById, registerUser } from "../controller/users";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", registerUser);

module.exports = userRouter;
