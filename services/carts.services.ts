import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findCartByUserId = (id: number) => {
  return prisma.cart.findUnique({
    where: {
      userId: id,
    },
    include: {
      cartItem: true,
    },
  });
};

export const addCart = (userId: number) => {
  return prisma.cart.create({
    data: {
      userId,
    },
  });
};

export const findCartItemById = (id: number) => {
  return prisma.cartItem.findUnique({
    where: {
      id,
    },
  });
};

export const createCartItem = (cartId: number, productId: number, price: number) => {
  return prisma.cartItem.create({
    data: {
      quantity: 1,
      cartId,
      productId,
      price,
    },
  });
};

export const removeCartItem = (id: number) => {
  return prisma.cartItem.delete({
    where: {
      id,
    },
  });
};

export const editQuantity = (id: number, quantity: number) => {
  return prisma.cartItem.update({
    where: {
      id,
    },
    data: {
      quantity,
    },
  });
};
