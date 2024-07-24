import Cart from "../models/cart-model.js";
import Product from "../models/product-model.js";
import User from "../models/user-model.js";

export async function serviceAddToCart(userId, productId, quantity) {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error(`Product with id ${productId} not found`);

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [],
        totalPrice: 0,
        orderDate: new Date(),
      });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { orders: cart._id },
    });

    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    const sum = cart.products.reduce(async (accPromise, currentValue) => {
      const acc = await accPromise;
      const product = await Product.findById(currentValue.product);
      const productQuantity = currentValue.quantity;
      return acc + product.price * productQuantity;
    }, Promise.resolve(0));

    cart.totalPrice = sum;
    await cart.save();

    return cart;
  } catch (e) {
    throw new Error(e.message);
  }
}
