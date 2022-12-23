import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { findProducts } from "../services/products.services";

const prisma = new PrismaClient();

// @desc Get all products
// @route GET /api/products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await findProducts();

    if (products.length < 1) {
      return res.status(404).send({
        message: "No products found",
      });
    }

    return res.status(200).send(products);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
