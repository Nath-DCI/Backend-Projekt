import express from "express";
import {
  registration,
  login,
  logout,
  refresh,
  getUsers,
  getUser,
  activate,
} from "../controllers/user-controller.js";
import { body } from "express-validator";

const userRouter = express.Router();

userRouter.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  registration
);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/activate/:link", activate);
userRouter.get("/refresh", refresh);
userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUser);

export default userRouter;
