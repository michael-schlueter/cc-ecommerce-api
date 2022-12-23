import express from "express";
import { getAllProducts } from "../controller/products";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
