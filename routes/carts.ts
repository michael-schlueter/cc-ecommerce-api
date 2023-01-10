import express from "express";
import { getCartByUserId, createCart } from "../controller/carts";
import { checkAuthentication } from "../middleware";

const cartRouter = express.Router();

cartRouter.get("/", checkAuthentication, getCartByUserId);
cartRouter.post("/", checkAuthentication, createCart);

module.exports = cartRouter;
