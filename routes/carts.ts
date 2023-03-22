import express from "express";
import {
  getCartByUserId,
  createCart,
  addItemToCart,
  deleteItemFromCart,
  updateItemQuantity,
  checkout,
} from "../controller/carts";
import { checkAuthentication } from "../middleware";

const cartRouter = express.Router();

/**
 * @swagger
 * /api/carts/:
 *    get:
 *      summary: Get the cart of a specific user
 *      produces:
 *        - application/json
 *      tags:
 *        - Carts
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
 *          description: Returns the cart for a specific user
 *          schema:
 *            $ref: '#/components/schemas/Cart'
 *        "404":
 *          description: Cart not found
 */
cartRouter.get("/", checkAuthentication, getCartByUserId);

/**
 * @swagger
 * /api/carts:
 *    post:
 *      summary: Creates a new cart
 *      produces:
 *        - application/json
 *      tags:
 *        - Carts
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
 *        "201":
 *          description: Returns created cart
 *          schema:
 *            $ref: '#/components/schemas/Cart'
 *        "400":
 *          description: User already has an active cart
 */
cartRouter.post("/", checkAuthentication, createCart);

/**
 * @swagger
 * /api/carts/{id}:
 *    post:
 *      summary: Add an item to the user's cart
 *      produces:
 *        - application/json
 *      tags:
 *        - Carts
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: userId
 *          description: The user's ID, extracted from the payload of the provided access token
 *          in: header
 *          type: integer
 *          required: true
 *          example: 1
 *      requestBody:
 *        description: Product data of the item to add
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: integer
 *                  example: 2
 *      responses:
 *        "201":
 *          description: Item added to the user's cart
 *          schema:
 *            $ref: '#/components/schemas/CartItem'
 *        "400":
 *          description: Product does not exist / Item is already in cart
 *        "404":
 *          description: Cart not found
 */
cartRouter.post("/:id", checkAuthentication, addItemToCart);
cartRouter.put("/", checkAuthentication, updateItemQuantity);
cartRouter.delete("/", checkAuthentication, deleteItemFromCart);
cartRouter.post("/:id/checkout", checkAuthentication, checkout);

module.exports = cartRouter;
