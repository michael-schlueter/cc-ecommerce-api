import express from "express";
import { getCartById } from "../controller/carts";

const cartRouter = express.Router();

cartRouter.get("/", getCartById);

module.exports = cartRouter;
