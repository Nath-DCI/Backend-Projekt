import Cart from "../models/cart-model.js";
import Product from "../models/product-model.js";
import User from "../models/user-model.js";

export async function totalPrice(cart) {
  const sum = cart.products.reduce(async (accPromise, currentValue) => {
    const acc = await accPromise;
    const product = await Product.findById(currentValue.product);
    const productQuantity = currentValue.quantity;
    return acc + product.price * productQuantity;
  }, Promise.resolve(0));
  return sum;
}

export async function serviceAddToCart(userId, productId, quantity) {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error(`Product with id ${productId} not found`);

    const user = await User.findById(userId).populate("orders");
    if (!user) throw new Error("User not found");

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [],
        totalPrice: 0,
        orderDate: new Date(),
      });
    }
    user.orders = cart._id;
    await user.save();

    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    cart.totalPrice = await totalPrice(cart);
    await cart.save();

    return cart;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function serviceUpdateCart(cart, updates) {
  const updatedCart = await Cart.findByIdAndUpdate(cart._id, updates, {
    new: true,
  });
  updatedCart.totalPrice = await totalPrice(updatedCart);
  await updatedCart.save();
  return updatedCart;
}
