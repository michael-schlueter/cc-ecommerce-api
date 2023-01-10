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
