import jwt from "jsonwebtoken";
import Token from "../models/token-model.js";
import dotenv from "dotenv";
import { ConnectionClosedEvent } from "mongodb";
dotenv.config();

export async function generateToken(payload) {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
}

export async function saveToken(userId, refreshToken) {
  const tokenData = await Token.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = Token.create({ user: userId, refreshToken });
  return token;
}

export async function removeToken(refreshToken) {
  const tokenData = await Token.deleteOne({ refreshToken });
  return tokenData;
}

export async function findToken(refreshToken) {
  console.log("in tokenservice", refreshToken);
  const tokenData = await Token.findOne({ refreshToken });
  return tokenData;
}

export async function validateAccessToken(token) {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return userData;
  } catch (e) {
    console.log(e);
  }
}

export async function validateRefreshToken(token) {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return userData;
  } catch (e) {
    console.log(e);
  }
}
