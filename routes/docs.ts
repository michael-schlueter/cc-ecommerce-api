const swagger = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const router = express.Router();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce",
      version: "1.0.0",
      description:
        "Backend API for an e-commerce platform. Built with Prisma, Express and Node",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/",
      },
    },
  },
  apis: [
    "./routes/carts.ts",
    "./routes/orders.ts",
    "./routes/products.ts",
    "./routes/users.ts",
  ],
};

const specs = swagger(swaggerOptions);

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

module.exports = router;
