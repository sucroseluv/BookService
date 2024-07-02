import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { Exception } from "../models/exception.model";

export class Groups {
  public static readonly READ = "read";
  public static readonly CREATE = "create";
  public static readonly UPDATE = "update";
  public static readonly AUTH = "auth";
  public static readonly ALL = [this.READ, this.CREATE, this.UPDATE, this.AUTH];
}

export function validateBody<T>(
  targetClass: { new (...data: any[]): T },
  groups: string[] = []
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        throw new Exception(400, "Empty request body");
      }

      req.body = Object.setPrototypeOf(req.body, targetClass.prototype);
      const errors = await validate(req.body, {
        groups,
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      if (errors.length > 0) {
        throw new Exception(400, "Validation failed", errors);
      }

      req.body = plainToInstance(targetClass, req.body, { groups });
      next();
    } catch (err) {
      next(err);
    }
  };
}
