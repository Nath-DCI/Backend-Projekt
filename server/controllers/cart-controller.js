import {
  serviceAddToCart,
  serviceUpdateCart,
  totalPrice,
} from "../service/cart-service.js";
import Cart from "../models/cart-model.js";
import User from "../models/user-model.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await serviceAddToCart(userId, productId, quantity);

    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export async function getCart(req, res) {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).populate("orders");
    const cart = await Cart.findOne({ user }).populate("products.product");
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
  }
}

export async function updateCart(req, res, next) {
  try {
    const updates = req.body;
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const updatedCart = await serviceUpdateCart(cart, updates);
    res.status(200).json(updatedCart);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to update cart" });
  }
}

export async function deleteCart(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ error: "No carts found for this user" });
    }

    await Cart.deleteOne({ _id: cart._id });
    user.orders = null;
    await user.save();

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error(error);
  }
}
export async function deleteFromCart(req, res, next) {
  try {
    const { productId } = req.body;
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user: user._id },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate("products.product");

    updatedCart.totalPrice = await totalPrice(updatedCart);

    await updatedCart.save();
    res.status(200).json(updatedCart);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to update cart" });
  }
}
