import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUsers = () => {
  return prisma.user.findMany();
};

export const findUserById = (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};
