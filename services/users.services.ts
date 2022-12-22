import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUsers = () => {
    return prisma.user.findMany()
}