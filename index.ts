import express, { Express } from "express";
import dotenv from "dotenv";
const logger = require("morgan");

dotenv.config();

const userRouter = require("./routes/users");
const productRouter = require("./routes/products");
const cartRouter = require("./routes/carts");
const orderRouter = require("./routes/orders");

const app: Express = express();
const port = process.env.PORT;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.use("/", (req, res) => {
  res.status(404).send("Route Not Found: Please use the /api-docs endpoint");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
