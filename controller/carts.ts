import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { findCartById } from "../services/carts.services";

const prisma = new PrismaClient();

// @desc Get specific cart by id
// @route GET /api/carts/id
export const getCartById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cart = await findCartById(parseInt(id));

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
