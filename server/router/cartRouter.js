import express from "express";
import {
  addToCart,
  getCart,
  deleteCart,
  updateCart,
} from "../controllers/cart-controller.js";
import { sendInvoice } from "../service/mail-service.js";
import User from "../models/user-model.js";
import Cart from "../models/cart-model.js";
import { findUserByEmail } from "../service/user-service.js";

const cartRouter = express.Router();

cartRouter.post("/addToCart", addToCart);

cartRouter.get("/getCart", getCart);
cartRouter.delete("/deleteCart", deleteCart);
cartRouter.put("/updateCart/:email", updateCart);
//cartRouter.get("/sendCart", sendCart);

cartRouter.post("/test-invoice", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const cart = await Cart.findOne({ user: user._id }).populate(
      "products.product"
    );
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      deliveryDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      customerDetails: {
        name: user.email,
        contact: `1-234-532 | ${user.email}`,
      },
      orderSummary: cart.products.map((item) => ({
        productName: item.product.name,
        description: item.product.description || "",
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.quantity * item.product.price,
      })),
      subtotal: cart.totalPrice,
      shipping: 10.0,
      totalAmountDue: cart.totalPrice + 10.0,
    };
    await sendInvoice(email, invoiceData);
    res.status(200).json({ message: "Invoice sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send invoice" });
  }
});

export default cartRouter;
