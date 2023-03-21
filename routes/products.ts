import express from "express";
import { getProducts, getProductById } from "../controller/products";

const productRouter = express.Router();

/**
 * @swagger
 * /api/products:
 *    get:
 *      summary: Get all products or all products of a specific category
 *      produces:
 *        - application/json
 *      tags:
 *        - Products
 *      parameters:
 *        - name: category
 *          description: Numeric id of a category
 *          in: query
 *          type: integer
 *          required: false
 *          example: 1
 *      responses:
 *        "200":
 *          description: Returns a list of all products (for a specific category if provided)
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Product'
 *        "404":
 *          description: No products found (in this category)
 */
productRouter.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *    get:
 *      summary: Get a specific product with its corresponding categories
 *      produces:
 *        - application/json
 *      tags:
 *        - Products
 *      parameters:
 *        - name: id
 *          description: Product id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "200":
 *          description: Returns a single product with its categories
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *        "404":
 *          description: Product not found
 */
productRouter.get("/:id", getProductById);

module.exports = productRouter;
