import User from "../models/user-model.js";
import { createHash } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { sendActivationMessage } from "./mail-service.js";
import {
  generateToken,
  saveToken,
  removeToken,
  validateRefreshToken,
  findToken,
} from "./token-service.js";

export async function userServiceRegistration(email, password) {
  const candidate = await User.findOne({ email });
  if (candidate) {
    throw new Error("User already exists");
  }
  const activationLink = uuidv4();
  const sha256 = createHash("sha256");
  const hashPassword = sha256.update(password).digest("hex");
  const user = await User.create({
    email,
    password: hashPassword,
    activationLink: activationLink,
  });
  await sendActivationMessage(
    email,
    `http://localhost:5000/api/activate/${activationLink}`
  );
  const tokens = await generateToken({
    id: user.id,
    email: user.email,
    isActivated: user.isActivated,
  });
  await saveToken(user.id, tokens.refreshToken);

  return {
    ...tokens,
    user: {
      email: user.email,
      id: user.id,
      isActivated: user.isActivated,
    },
  };
}

export async function userServiceActivate(activationLink) {
  const user = await User.findOne({ activationLink });
  if (!user) {
    throw new Error("Incorrect activation link");
  }
  user.isActivated = true;
  await user.save();
}

export async function userServiceLogin(email, password) {
  const user = await User.findOne({ email: email });
  console.log(user);
  if (!user) {
    throw new Error("Cannot find user");
  }

  const sha256 = createHash("sha256");
  const hashPassword = sha256.update(password).digest("hex");
  if (hashPassword !== user.password) {
    throw new Error("Invalid password");
  }

  const tokens = await generateToken({
    id: user.id,
    email: user.email,
    isActivated: user.isActivated,
  });
  await saveToken(user.id, tokens.refreshToken);

  return {
    ...tokens,
    user: {
      email: user.email,
      id: user.id,
      isActivated: user.isActivated,
    },
  };
}

export async function userServiceLogout(refreshToken) {
  const token = await removeToken(refreshToken);
  return token;
}

export async function userServiceRefresh(refreshToken) {
  if (!refreshToken) {
    throw new Error("User is NOT authorized");
  }
  const userData = await validateRefreshToken(refreshToken);
  console.log("Данные пользователя из токена:", userData);

  const tokenFromDb = await findToken(refreshToken);
  console.log("tokenFromDb", tokenFromDb);

  if (!userData || !tokenFromDb) {
    throw new Error("User is not authorized");
  }
  const user = await User.findById(userData.id);
  console.log(user);
  const tokens = await generateToken({
    id: user.id,
    email: user.email,
    isActivated: user.isActivated,
  });
  console.log("neuToken", tokens);
  await saveToken(user.id, tokens.refreshToken);
  return tokens; //kj (userData);
}
