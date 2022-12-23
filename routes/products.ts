import express from "express";
import { getAllProducts, getProductById } from "../controller/products";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/id", getProductById);