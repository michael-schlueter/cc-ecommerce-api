import express from "express";
import {
  getCartByUserId,
  createCart,
  addItemToCart,
  deleteItemFromCart,
  updateItemQuantity,
  checkout,
} from "../controller/carts";
import { checkAuthentication } from "../middleware";

const cartRouter = express.Router();

cartRouter.get("/", checkAuthentication, getCartByUserId);
cartRouter.post("/", checkAuthentication, createCart);
cartRouter.post("/:id", checkAuthentication, addItemToCart);
cartRouter.put("/", checkAuthentication, updateItemQuantity);
cartRouter.delete("/", checkAuthentication, deleteItemFromCart);
cartRouter.post("/:id/checkout", checkAuthentication, checkout);

module.exports = cartRouter;
