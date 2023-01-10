import express from "express";
import { getCartByUserId } from "../controller/carts";
import { checkAuthentication } from "../middleware";

const cartRouter = express.Router();

cartRouter.get("/", checkAuthentication, getCartByUserId);

module.exports = cartRouter;
