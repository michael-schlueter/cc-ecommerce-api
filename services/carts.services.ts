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

export const createCartItem = (cartId: number, productId: number) => {
    return prisma.cartItem.create({
      data: {
        quantity: 1,
        cartId,
        productId,
      }
    })
}


