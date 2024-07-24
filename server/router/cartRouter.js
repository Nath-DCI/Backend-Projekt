import express from "express";
import {
  addToCart,
  getCart,
  deleteCart,
  //   updateCart,
} from "../controllers/cart-controller.js";

const cartRouter = express.Router();

cartRouter.post("/addToCart", addToCart);

cartRouter.get("/getCart", getCart);
cartRouter.delete("/deleteCart", deleteCart);
// cartRouter.put("/updateCart", updateCart);
//cartRouter.get("/sendCart", sendCart);

export default cartRouter;
