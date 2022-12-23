import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findProducts = () => {
  return prisma.product.findMany();
};
