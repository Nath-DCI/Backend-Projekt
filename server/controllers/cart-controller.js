import { serviceAddToCart } from "../service/cart-service.js";
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
    const { email } = req.body;
    const user = await User.findOne({ email });
    const cart = await Cart.findOne({ user });
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
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const updatedCart = await Cart.findByIdAndUpdate(cart.id, updates, {
      new: true,
    });
    res.status(200).json(updatedCart);
  } catch (e) {
    console.log(e);
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

    user.orders = user.orders.filter(
      (orderId) => orderId.toString() !== cart._id.toString()
    );
    await user.save();

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error(error);
  }
}
