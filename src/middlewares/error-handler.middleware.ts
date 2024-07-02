import { Request, Response, NextFunction } from "express";
import { Exception } from "../models/exception.model";
import { StatusCodes } from "http-status-codes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error has occured: ", err);
  if (err instanceof Exception) {
    res.status(err.status).send(err.json());
  } else if (err instanceof PrismaClientKnownRequestError) {
    let status = 500;

    if (err.code === "P2025") {
      status = 404;
    }
    res
      .status(status)
      .send(
        (process.env.NODE_ENV === "development"
          ? new Exception(status, "Prisma server error", err)
          : new Exception(status)
        ).json()
      );
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(
        new Exception(StatusCodes.INTERNAL_SERVER_ERROR, err.message).json()
      );
  }
}
