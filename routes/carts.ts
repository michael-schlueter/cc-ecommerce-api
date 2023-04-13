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
 *          description: Product does not exist / Item is already in cart / Expected productId to be of type number
 *        "404":
 *          description: Cart not found
 */
cartRouter.post("/:id", checkAuthentication, addItemToCart);

/**
 * @swagger
 * /api/carts/:
 *    put:
 *      summary: Updates the quantity of an item in the user's cart
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
 *        description: Updated item quantity
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                cartItemId:
 *                  type: integer
 *                  example: 1
 *                quantity:
 *                  type: integer
 *                  example: 3
 *      responses:
 *        "200":
 *          description: Returns updated cart item
 *          schema:
 *            $ref: '#/components/schemas/CartItem'
 *        "400":
 *          description: Item not found in the cart / You have to provide a valid quantity (positive number) / "Expected cartItemId and quantity to be a number"
 *        "404":
 *          description: Cart not found
 */
cartRouter.put("/", checkAuthentication, updateItemQuantity);

/**
 * @swagger
 * /api/carts/:
 *    delete:
 *      summary: Removes a specific item from the user's cart
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
 *        description: Item data of the item to remove
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                cartItemId:
 *                  type: integer
 *                  example: 1
 *      responses:
 *        "204":
 *          description: Cart Item removed
 *        "400":
 *          description: Cart Item not found in Cart / Expected cartItemId to be a number
 *        "404":
 *          description: Cart not found
 */
cartRouter.delete("/", checkAuthentication, deleteItemFromCart);

/**
 * @swagger
 * /api/carts/checkout:
 *    post:
 *      summary: Creates a new order
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
 *          description: Returns created order
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *        "400":
 *          description: Order was not able to process
 *        "404":
 *          description: User has no cart / There are no items in the cart
 */
cartRouter.post("/:id/checkout", checkAuthentication, checkout);

module.exports = cartRouter;
