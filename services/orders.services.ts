import { CartItem, Order, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = (total: number, userId: number) => {
  return prisma.order.create({
    data: {
      total,
      userId,
      status: "Pending",
    },
  });
};

export const generateOrderItems = (order: Order, cartItem: CartItem) => {
  return prisma.orderItem.create({
    data: {
      orderId: order.id,
      quantity: cartItem.quantity,
      productId: cartItem.productId,
    },
  });
};

export const findOrdersByUserId = (id: number) => {
  return prisma.order.findMany({
    where: {
      userId: id,
    },
  });
};

export const findOrderByOrderId = (id: number) => {
  return prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      orderItem: true,
    },
  });
};

export const updateOrderStatus = (
  id: number,
  status: "Complete" | "Pending" | "Finalized" | "Cancelled"
) => {
  return prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};
