import { Schema, model } from "mongoose";

const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
});

export default model("Cart", CartSchema);
