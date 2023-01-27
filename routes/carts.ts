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
 * components:
 *  schemas:
 *      Cart:
 *          type: object
 *          required:
 *              - userId
 *          properties:
 *              userId:
 *                  type: integer
 *                  description: Numeric id of the user who the cart belongs to
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: Date-time the cart was created
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *                  description: Date-time the cart was lastly updated
 *              cartItems:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/CartItem'
 *          example:
 *              userId: 2
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
 *      CartItem:
 *          type: object
 *          required:
 *              - quantity
 *              - price
 *              - cartId
 *              - productId
 *          properties:
 *              quantity:
 *                  type: integer
 *                  description: Quantity of the cart item in a specific cart
 *              price:
 *                  type: string
 *                  description: Price of the cart item
 *              cartId:
 *                  type: integer
 *                  description: Numeric id of the cart the item belongs to
 *              productId:
 *                  type: integer
 *                  description: Numeric id of the product the cartItem represents
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
 *              price: 12.99
 *              cartId: 1
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
cartRouter.post("/", checkAuthentication, createCart);
cartRouter.post("/:id", checkAuthentication, addItemToCart);
cartRouter.put("/", checkAuthentication, updateItemQuantity);
cartRouter.delete("/", checkAuthentication, deleteItemFromCart);
cartRouter.post("/:id/checkout", checkAuthentication, checkout);

module.exports = cartRouter;
