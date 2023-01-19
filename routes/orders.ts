import express from "express";
import { getOrderByOrderId, getOrdersByUserId } from "../controller/orders";
import { checkAuthentication } from "../middleware";

const orderRouter = express.Router();

orderRouter.get("/", checkAuthentication, getOrdersByUserId);
orderRouter.get("/:id", getOrderByOrderId);
module.exports = orderRouter;