import db from "./db.service";
import { UserModel } from "../models/user.model";
import { Exception } from "../models/exception.model";
import { StatusCodes } from "http-status-codes";
import { User } from "@prisma/client";
import { hash, verify } from "argon2";
import { generateToken } from "../utils/jwt.util";
import { ROLES } from "../middlewares/auth.middleware";
import { sendVerifyEmail, verifyEmailToken } from "./mail.service";

export async function registration(user: UserModel) {
  const existing = await db.user.findFirst({
    where: { OR: [{ username: user.username }, { email: user.email }] },
  });

  if (existing) {
    const checkFields: (keyof User)[] = ["email", "username"];
    const errorMessage = `User with such ${checkFields
      .filter((f) => user[f] === existing[f])
      .join(" and ")} already exists`;
    throw new Exception(StatusCodes.CONFLICT, errorMessage);
  }

  if (!(await sendVerifyEmail(user)))
    throw new Exception(500, "Error due send verify email");

  const hashedPassword = await hash(user.password);
  const newUser = await db.user.create({
    data: {
      ...user,
      password: hashedPassword,
      role: ROLES.USER,
    },
  });

  return new UserModel(newUser);
}

export async function verifyUser(token: string) {
  const { username } = verifyEmailToken(token);
  const user = await db.user.update({
    where: { username },
    data: { active: true },
  });
  return new UserModel(user);
}

export async function login(user: UserModel) {
  const existing = await db.user.findFirst({
    where: { username: user.username },
  });

  if (!existing || !(await verify(existing.password, user.password))) {
    throw new Exception(
      StatusCodes.UNAUTHORIZED,
      `Wrong ${!existing ? "username" : "password"}`
    );
  }
  if (!existing.active) {
    throw new Exception(
      StatusCodes.FORBIDDEN,
      `Please activate your account by activating the link on your email address.`
    );
  }

  const token = generateToken(existing, "auth");

  return { token };
}

export async function getUserById(id: number) {
  const existing = await db.user.findFirst({
    where: { id },
  });

  if (!existing) {
    throw new Exception(StatusCodes.NOT_FOUND);
  }

  return new UserModel(existing);
}

export async function updateUserRole(id: number, user: UserModel) {
  const updatedUser = await db.user.update({
    where: { id },
    data: { role: user.role },
  });

  if (!updatedUser) {
    throw new Exception(StatusCodes.NOT_FOUND);
  }

  return new UserModel(updatedUser);
}

export default {
  registration,
  verifyUser,
  login,
  getUserById,
  updateUserRole,
};
