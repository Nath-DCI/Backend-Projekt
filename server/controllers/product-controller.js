import { validationResult } from "express-validator";
import {
  serviceAddProduct,
  serviceUpdateProduct,
  serviceDeleteProduct,
  serviceGetProducts,
  serviceGetProduct,
} from "../service/product-service.js";

export async function addProduct(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation error", errors });
    }

    const { name, price, description, stock, article } = req.body;
    const productData = await serviceAddProduct(
      name,
      price,
      description,
      stock,
      article
    );
    return res.json(productData);
  } catch (e) {
    console.log(e);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const updates = req.body;
    const { article } = req.params;
    const productData = await serviceUpdateProduct(updates, article);
    return res.json(productData);
  } catch (e) {
    console.log(e);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { article } = req.params;
    const productData = await serviceDeleteProduct(article);
    return res.json(productData);
  } catch (e) {
    console.log(e);
  }
}

export async function getProducts(req, res, next) {
  try {
    const productData = await serviceGetProducts();
    return res.json(productData);
  } catch (e) {
    console.log(e);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { article } = req.params;
    const productData = await serviceGetProduct(article);
    return res.json(productData);
  } catch (e) {
    console.log(e);
  }
}
