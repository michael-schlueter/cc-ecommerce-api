import express from "express";
import { getOrdersByUserId } from "../controller/orders";
import { checkAuthentication } from "../middleware";

const orderRouter = express.Router();

orderRouter.get("/", checkAuthentication, getOrdersByUserId);
module.exports = orderRouter;