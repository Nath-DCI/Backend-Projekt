import Product from "../models/product-model.js";

export async function serviceAddProduct(
  name,
  price,
  description,
  stock,
  article
) {
  const newProduct = await Product.findOne({ name });
  if (newProduct) {
    throw new Error("Product already exists");
  }

  const product = Product.create({
    name,
    price,
    description,
    stock,
    article,
  });

  return product;
}

export async function serviceUpdateProduct(updates, article) {
  const product = await Product.findOne({ article });
  if (!product) {
    throw new Error("Product not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(product.id, updates, {
    new: true,
  });
  return updatedProduct;
}

export async function serviceDeleteProduct(article) {
  const product = await Product.findOne({ article });
  if (!product) {
    throw new Error("Product not found");
  }

  const deletedProduct = await Product.findByIdAndDelete(product);
  return deletedProduct;
}

export async function serviceGetProducts() {
  const products = await Product.find();
  return products;
}

export async function serviceGetProduct(article) {
  const product = await Product.findOne({ article });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
}
