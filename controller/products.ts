import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { findProductById, findProducts,  } from "../services/products.services";

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

// @desc Get specific product by id
// @route GET /api/products/id
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await findProductById(parseInt(id));

    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }

    return res.status(200).send(product);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

// @desc Get products by category
// @route GET /api/products?category={categoryId}
export const getProductsByCategory = async (req: Request, res: Response) => {
  // @ts-ignore
  const categoryId = parseInt(req.query.category);

  try {

  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
