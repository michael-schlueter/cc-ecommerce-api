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

export const addItemsToOrder = (order: Order, cartItems: CartItem[]) => {
    const orderItems = cartItems.map(cartItem => {
        return prisma.orderItem.create({
            data: {
                quantity: cartItem.quantity,
                orderId: order.id,
                productId: cartItem.productId
            }
        })
    })
    return prisma.order.update({
        where: {
            id: order.id
        },
        data: {
            // @ts-ignore
            orderItem: orderItems
        }
    })
}
