import express from "express";
import { getProducts, getProductById, } from "../controller/products";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);

module.exports = productRouter;