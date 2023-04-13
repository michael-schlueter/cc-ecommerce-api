import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  addCart,
  createCartItem,
  findCartByUserId,
  removeCartItem,
  editQuantity,
  deleteCart,
} from "../services/carts.services";
import {
  createOrder,
  generateOrderItems,
  updateOrderStatus,
} from "../services/orders.services";
import { findProductById } from "../services/products.services";

const prisma = new PrismaClient();

// @desc Get specific cart by userId
// @route GET /api/carts/
export const getCartByUserId = async (req: Request, res: Response) => {
  const userId = req.payload!.userId;

  try {
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
  const userId = req.payload!.userId;

  try {
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
  const userId = req.payload!.userId;
  let { productId } = req.body;
  productId = parseInt(productId);

  try {
    // Get the cart of the user
    const userCart = await findCartByUserId(userId);

    if (Number.isNaN(productId)) {
      return res.status(400).send({
        message: "Expected productId to be a number"
      })
    }
    const product = await findProductById(productId);

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
          cartItem.productId === productId &&
          cartItem.cartId === userCart.id
      )
    ) {
      return res.status(400).send({
        message: "Item is already in cart",
      });
    }

    // Add cart item to the cart of the user
    const cartItem = await createCartItem(
      userCart.id,
      productId,
      product.price
    );
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
  const userId = req.payload!.userId;
  let { cartItemId, quantity } = req.body;
  cartItemId = parseInt(cartItemId);
  quantity = parseInt(quantity);

  try {
    const cart = await findCartByUserId(userId);

    if (!cart) {
      return res.status(404).send({
        message: "Cart not found",
      });
    }

    if (Number.isNaN(cartItemId) || Number.isNaN(quantity)) {
      return res.status(400).send({
        message: "Expected cartItemId and quantity to be a number"
      })
    }

    // Check if cartItem belongs to the cart of the user
    if (!cart.cartItem.find((item) => item.id === cartItemId)) {
      return res.status(400).send({
        message: "Item not found in the cart",
      });
    }

    if (!quantity || quantity === "0") {
      return res.status(400).send({
        message: "You have to provide a valid quantity (positive number)",
      });
    }

    const updatedCartItem = await editQuantity(
      cartItemId,
      quantity
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
  const userId = req.payload!.userId;
  let { cartItemId } = req.body;
  cartItemId = parseInt(cartItemId);

  try {
    const cart = await findCartByUserId(userId);

    if (!cart) {
      return res.status(404).send({
        message: "Cart not found",
      });
    }

    if (Number.isNaN(cartItemId)) {
      return res.status(400).send({
        message: "Expected cartItemId to be a number"
      })
    }

    // Check if cartItem belongs to the cart of the user
    if (!cart.cartItem.find((item) => item.id === cartItemId)) {
      return res.status(400).send({
        message: "Cart item not found in cart",
      });
    }
    await removeCartItem(cartItemId);

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
  const userId = req.payload!.userId;
  // const { paymentInfo } = req.body;

  try {
    // Find cart for user
    const cart = await findCartByUserId(userId);
    if (!cart) {
      return res.status(404).send({
        message: "User has no cart",
      });
    }

    // Check if cart has any items
    if (cart.cartItem.length <= 0) {
      return res.status(404).send({
        message: "There are no items in the cart",
      });
    }

    // Calculate total price for all items in cart
    let total = cart.cartItem.reduce((total, item) => {
      return (total += item.quantity * Number(item.price));
    }, 0);

    // Generate order
    const order = await createOrder(total, userId);

    // Generate order items
    const orderItems = await Promise.all(
      cart.cartItem.map(async (item) => {
        return await generateOrderItems(order, item);
      })
    );

    if (orderItems.length <= 0 || !orderItems) {
      return res.status(404).send({
        message: "There are no order items to process",
      });
    }

    // Make charge to payment method (not required in this project)

    // On successful charge, update order status
    const updatedOrder = await updateOrderStatus(order.id, "Complete");

    if (!updatedOrder) {
      return res.status(400).send({
        message: "Order was not able to process",
      });
    }

    // / Remove cart (or all cart items)
    await deleteCart(cart.id);
    return res.status(201).send(updatedOrder);
  } catch (err: any) {
    res.status(500).send({
      message: err.message,
    });
  }
};
