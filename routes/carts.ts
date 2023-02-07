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
cartRouter.post("/", checkAuthentication, createCart);
cartRouter.post("/:id", checkAuthentication, addItemToCart);
cartRouter.put("/", checkAuthentication, updateItemQuantity);
cartRouter.delete("/", checkAuthentication, deleteItemFromCart);
cartRouter.post("/:id/checkout", checkAuthentication, checkout);

module.exports = cartRouter;
