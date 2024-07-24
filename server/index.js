import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./router/userRouter.js";
import productRouter from "./router/productRouter.js";
import cartRouter from "./router/cartRouter.js";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use("/api", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

const port = process.env.PORT || 3000;
const mongo_url = process.env.DB_URL;

const start = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port= ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
