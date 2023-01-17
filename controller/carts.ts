import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  addCart,
  createCartItem,
  findCartByUserId,
  removeCartItem,
  findCartItemById,
  editQuantity,
} from "../services/carts.services";
import { findProductById } from "../services/products.services";
import { findUserById } from "../services/users.services";

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
    const newCart = await addCart(userId);

    return res.status(201).send(newCart);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

// @desc Add an item to a cart
// @route POST /api/carts/id
export const addItemToCart = async (req: Request, res: Response) => {
  const userId = req.payload?.userId;
  const { productId } = req.body;

  try {
    // Check if user is not logged in (userId is provided)
    if (!userId) {
      return res.status(400).send({
        message: "User not logged in",
      });
    }

    // Get the cart of the user
    const userCart = await findCartByUserId(userId);
    const product = await findProductById(parseInt(productId));

    if (!product) {
      return res.status(400).send({
        message: "Product does not exist",
      });
    }

    if (!userCart) {
      return res.status(404).send({
        message: "Cart not found",
      });
    }

    // Check if item is already in cart
    if (
      userCart.cartItem.find(
        (cartItem) =>
          cartItem.productId === parseInt(productId) &&
          cartItem.cartId === userCart.id
      )
    ) {
      return res.status(400).send({
        message: "Item is already in cart",
      });
    }

    // Add cart item to the cart of the user
    const cartItem = await createCartItem(userCart.id, parseInt(productId));
    return res.status(201).send(cartItem);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

// @desc Update quantity for an item from a cart
// @route PUT /api/carts/
export const updateItemQuantity = async (req: Request, res: Response) => {
  const userId = req.payload?.userId;
  const { cartItemId, quantity } = req.body;

  try {
    // Check if user is logged in
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

    // Check if cartItem belongs to the cart of the user
    if (!cart.cartItem.find((item) => item.id === parseInt(cartItemId))) {
      return res.status(400).send({
        message: "Unauthorized to remove item from this cart",
      });
    }

    if (!quantity || quantity === "0") {
      return res.status(400).send({
        message: "You have to provide a valid quantity (positive number)",
      });
    }

    const updatedCartItem = await editQuantity(
      parseInt(cartItemId),
      parseInt(quantity)
    );

    return res.status(200).send(updatedCartItem);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

// @desc Delete an item from a cart
// @route DELETE /api/carts/
export const deleteItemFromCart = async (req: Request, res: Response) => {
  const userId = req.payload?.userId;
  const { cartItemId } = req.body;

  try {
    // Check if user is logged in
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

    // Check if cartItem belongs to the cart of the user
    if (!cart.cartItem.find((item) => item.id === parseInt(cartItemId))) {
      return res.status(400).send({
        message: "Unauthorized to remove item from this cart",
      });
    }
    await removeCartItem(parseInt(cartItemId));

    return res.sendStatus(204);
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
