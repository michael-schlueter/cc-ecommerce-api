import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { findCartByUserId } from "../services/carts.services";

const prisma = new PrismaClient();

// @desc Get specific cart by id
// @route GET /api/carts/id
export const getCartByUserId = async (req: Request, res: Response) => {
  const userId = req.payload?.userId;

  try {
    if (!userId) {
        return res.status(400).send({
            message: "User not logged in"
        })
    }

    const cart = await findCartByUserId(userId);

    if (!cart) {
      return res.status(404).send({
        message: "Cart not found",
      });
    }

    return res.status(200).send(cart);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
