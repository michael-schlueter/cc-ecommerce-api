import express from "express";
import {
  getCartByUserId,
  createCart,
  addItemToCart,
  deleteItemFromCart,
  updateItemQuantity,
} from "../controller/carts";
import { checkAuthentication } from "../middleware";

const cartRouter = express.Router();

cartRouter.get("/", checkAuthentication, getCartByUserId);
cartRouter.post("/", checkAuthentication, createCart);
cartRouter.post("/:id", checkAuthentication, addItemToCart);
cartRouter.put("/", checkAuthentication, updateItemQuantity);
cartRouter.delete("/", checkAuthentication, deleteItemFromCart);

module.exports = cartRouter;
