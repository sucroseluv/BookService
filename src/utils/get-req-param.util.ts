import { Request } from "express";
import { Exception } from "../models/exception.model";
import { StatusCodes } from "http-status-codes";

export function getReqId(
  req: Request,
  key = "id",
  errorMessage = `Specify correct ${key}`
) {
  const param = parseInt(req.params[key] as string);
  if (isNaN(param)) {
    throw new Exception(StatusCodes.BAD_REQUEST, errorMessage);
  }
  return param;
}
