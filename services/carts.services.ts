import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findCartById = (id: number) => {
  return prisma.cart.findUnique({
    where: {
      id,
    },
    include: {
      cartItem: true,
    },
  });
};
