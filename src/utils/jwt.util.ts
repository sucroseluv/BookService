import { User } from "@prisma/client";
import jwt, { SignOptions } from "jsonwebtoken";
import { Exception } from "../models/exception.model";
import { StatusCodes } from "http-status-codes";

const authJwtKey = process.env.AUTH_JWT_SECRET;
const verifyJwtKey = process.env.VERIFY_JWT_SECRET;

type JwtUser = Pick<User, "id" | "username">;

export const generateToken = (user: User, key: "auth" | "verify"): string => {
  const config: [string, SignOptions] =
    key === "auth" ? [authJwtKey, { expiresIn: "2h" }] : [verifyJwtKey, null];
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    ...config
  );

  return token;
};

export const verifyToken = (token: string, key: "auth" | "verify"): JwtUser => {
  try {
    const secretKey = key === "auth" ? authJwtKey : verifyJwtKey;
    const tokenData = jwt.verify(token, secretKey);
    return tokenData as JwtUser;
  } catch (error) {
    throw new Exception(
      key === "auth" ? StatusCodes.UNAUTHORIZED : StatusCodes.BAD_REQUEST
    );
  }
};
