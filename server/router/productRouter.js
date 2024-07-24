import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
} from "../controllers/product-controller.js";
import { body } from "express-validator";

const productRouter = express.Router();

productRouter.post(
  "/addProduct",
  body("name").isString().isLength({ min: 1 }),
  body("price").isFloat({ gt: 0 }),
  body("stock").isInt({ gt: 0 }),
  body("article").isLength({ min: 4, max: 4 }),
  addProduct
);

productRouter.put(
  "/updateProduct/:article",
  body("name").optional().isString().isLength({ min: 1 }),
  body("price").optional().isFloat({ gt: 0 }),
  body("stock").optional().isInt({ gt: 0 }),
  body("article").isLength({ min: 4, max: 4 }),
  updateProduct
);

productRouter.delete("/deleteProduct/:article", deleteProduct);

productRouter.get("/getProduct/:article", getProduct);
productRouter.get("/getProducts", getProducts);

export default productRouter;
