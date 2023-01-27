import express from "express";
import { getOrderByOrderId, getOrdersByUserId } from "../controller/orders";
import { checkAuthentication } from "../middleware";

const orderRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Order:
 *          type: object
 *          required:
 *              - total
 *              - status
 *              - userId
 *          properties:
 *              total:
 *                  type: decimal
 *                  description: Total sum of all items of the order
 *              status:
 *                  type: string
 *                  description: Status of the order (pending, completed or executed)
 *              userId:
 *                  type: integer
 *                  description: Numeric id of the user who created the order
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: Date-time the order was created
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *                  description: Date-time the order was lastly updated
 *              cartItems:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/OrderItem'
 *          example:
 *              total: 12.99
 *              status: Pending
 *              userId: 1
 *              createdAt: 2023-01-25 14:09:46.881
 *              updatedAt: 2023-01-25 14:09:46.881
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      OrderItem:
 *          type: object
 *          required:
 *              - quantity
 *              - price
 *              - cartId
 *              - productId
 *          properties:
 *              quantity:
 *                  type: integer
 *                  description: Quantity of the order item in a specific order
 *              orderId:
 *                  type: integer
 *                  description: Numeric id of the order the item belongs to
 *              productId:
 *                  type: integer
 *                  description: Numeric id of the product the orderItem represents
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: Date-time the cartItem was created
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *                  description: Date-time the cartItem was lastly updated
 *          example:
 *              quantity: 2
 *              orderId: 1
 *              productId: 2
 *              createdAt: 2023-01-25 14:09:46.881
 *              updatedAt: 2023-01-25 14:09:46.881
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

/**
 * @swagger
 * /api/orders:
 *    get:
 *      summary: Get all orders for a specific user
 *      produces:
 *        - application/json
 *      tags:
 *        - Orders
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: userId
 *          description: The user's ID, extracted from the payload of the provided access token
 *          in: header
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "200":
 *          description: Returns a list of all orders for a specific user
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Order'
 *        "404":
 *          description: No orders found
 */
orderRouter.get("/", checkAuthentication, getOrdersByUserId);

/**
 * @swagger
 * /api/orders/{id}:
 *    get:
 *      summary: Get a specific order
 *      produces:
 *        - application/json
 *      tags:
 *        - Orders
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: id
 *          description: order id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "200":
 *          description: Returns a single order
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *        "404":
 *          description: Order not found
 */
orderRouter.get("/:id", getOrderByOrderId);

module.exports = orderRouter;
