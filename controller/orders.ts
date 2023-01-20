import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  findOrderByOrderId,
  findOrdersByUserId,
} from "../services/orders.services";

const prisma = new PrismaClient();

// @desc Get orders for a specific user
// @route GET /api/orders/
export const getOrdersByUserId = async (req: Request, res: Response) => {
  const userId = req.payload?.userId;

  try {
    if (!userId) {
      return res.status(400).send("User not logged in");
    }

    const orders = await findOrdersByUserId(userId);
    if (orders.length == 0) {
      return res.status(404).send({
        message: "No orders found for this user",
      });
    }

    return res.status(200).send(orders);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

// @desc Get order for a specific orderId
// @route GET /api/orders/id
export const getOrderByOrderId = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    if (!orderId) {
      return res.status(404).send({
        message: "No valid orderId provided",
      });
    }

    const order = findOrderByOrderId(parseInt(orderId));
    if (!order) {
      return res.status(400).send({
        message: "No order found for this id",
      });
    }

    return res.status(200).send(order);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
