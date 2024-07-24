import {
  userServiceRegistration,
  userServiceLogin,
  userServiceLogout,
  userServiceActivate,
  userServiceRefresh,
} from "../service/user-service.js";
import { validationResult } from "express-validator";

export const registration = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation error", errors });
    }
    const { email, password } = req.body;
    const userData = await userServiceRegistration(email, password);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    console.log(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await userServiceLogin(email, password);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    console.log(e);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await userServiceLogout(refreshToken);
    res.clearCookie("refreshToken");
    return res.json(token);
  } catch (e) {
    console.log(e);
  }
};

export const activate = async (req, res, next) => {
  try {
    const activationLink = req.params.link;
    await userServiceActivate(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  } catch (e) {
    console.log(e);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await userServiceRefresh(refreshToken);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.json(userData);
  } catch (e) {
    console.log(e);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    res.json(["123", "456"]);
  } catch (e) {
    console.log(e);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params;
    res.json(userId);
  } catch (e) {
    console.log(e);
  }
};
