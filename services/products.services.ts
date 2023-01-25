import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findProducts = () => {
  return prisma.product.findMany({
    include: {
      categories: true,
    },
  });
};

export const findProductById = (id: number) => {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      categories: true,
    },
  });
};

export const findProductsByCategoryId = (id: number) => {
  return prisma.product.findMany({
    where: {
      categories: {
        some: {
          id,
        },
      },
    },
  });
};
