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
 *          example:
 *              total: 12.99
 *              status: Pending
 *              userId: 1
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
