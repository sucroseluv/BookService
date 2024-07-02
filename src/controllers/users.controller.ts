import { Request, Response, NextFunction } from "express";
import usersService from "../services/users.service";
import { getReqId } from "../utils/get-req-param.util";
import { Exception } from "../models/exception.model";
import { StatusCodes } from "http-status-codes";

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    res.sendInst(await usersService.registration(req.body));
  } catch (err: any) {
    console.error(`Error while signing up`, err.message);
    next(err);
  }
}

export async function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.params["token"];
    if (!token) {
      throw new Exception(StatusCodes.BAD_REQUEST, "Specify correct token");
    }
    res.sendInst(await usersService.verifyUser(token));
  } catch (err: any) {
    console.error(`Error while verifying`, err.message);
    next(err);
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    res.sendInst(await usersService.login(req.body));
  } catch (err: any) {
    console.error(`Error while signing in`, err.message);
    next(err);
  }
}

export async function userInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.sendInst(await usersService.getUserById(req.user.id));
  } catch (err: any) {
    console.error(`Error while getting user info`, err.message);
    next(err);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = getReqId(req);
    res.sendInst(await usersService.updateUserRole(userId, req.body));
  } catch (err: any) {
    console.error(`Error while updating user`, err.message);
    next(err);
  }
}
