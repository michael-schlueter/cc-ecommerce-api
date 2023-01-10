import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { addCart, findCartByUserId } from "../services/carts.services";

const prisma = new PrismaClient();

// @desc Get specific cart by userId
// @route GET /api/carts/
export const getCartByUserId = async (req: Request, res: Response) => {
  const userId = req.payload?.userId;

  try {
    // Check if user is not logged in (userId is provided)
    if (!userId) {
      return res.status(400).send({
        message: "User not logged in",
      });
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

// @desc Create a cart
// @route POST /api/carts/
export const createCart = async (req: Request, res: Response) => {
  const userId = req.payload?.userId;
  const total = 0;

  try {
    // Check if user is not logged in (userId is provided)
    if (!userId) {
      return res.status(400).send({
        message: "User not logged in",
      });
    }

    // Check if user already has an existing cart
    const cart = await findCartByUserId(userId);
    if (cart) {
      return res.status(400).send({
        message: "User already has an active cart",
      });
    }

    // Create new cart
    const newCart = await addCart(userId, total);

    return res.status(201).send(newCart);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};