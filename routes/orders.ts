import express from "express";
import { getOrderByOrderId, getOrdersByUserId } from "../controller/orders";
import { checkAuthentication } from "../middleware";

const orderRouter = express.Router();

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
