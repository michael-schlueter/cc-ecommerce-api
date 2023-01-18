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
import { createOrder, generateOrderItems } from "../services/orders.services";
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
    const cartItem = await createCartItem(userCart.id, parseInt(productId), product.price);
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

// @desc Checkout
// @route POST /api/carts/checkout
export const checkout = async (req: Request, res: Response) => {
  const userId = req.payload?.userId;
  // const { cartId, paymentInfo } = req.body;

  try {
    // Check if user is logged in
    if (!userId) {
      return res.status(400).send({
        message: "User not logged in",
      });
    }

    // Find cart for user
    const cart = await findCartByUserId(userId);
    if (!cart) {
      return res.status(404).send({
        message: "No friggin cart in the house",
      });
    }

    // Check if cart has any items
    if (cart.cartItem.length <= 0) {
      return res.status(404).send({
        message: "No items in the friggin cart",
      });
    }

    // Calculate total price for all items in cart
    let total = cart.cartItem.reduce((total, item) => {
      return total += item.quantity * Number(item.price);  
    }, 0)

    // Generate order
    const order = await createOrder(total, userId);

    // Generate order items
    const orderItems = await generateOrderItems(order, cart.cartItem[0]);
    console.log(orderItems);

    // const updatedOrder = await addItemsToOrder(order, cart.cartItem);
    // Remove cart (or all cart items)

    // Make charge to payment method (not required in this project)

    // On successful charge, update order status
    return res.status(201).send('Hello');
    
  } catch (err: any) {
    res.status(500).send({
      message: err.message,
    });
  }
};
