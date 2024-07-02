import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";
import { StatusCodes } from "http-status-codes";
import { Exception } from "../models/exception.model";
import db from "../services/db.service";

export const ROLES = {
  USER: parseInt("1", 2),
  ADMIN: parseInt("10", 2),
};
type SelectRoles = (roles: typeof ROLES) => number[];

export const authMiddleware =
  (selectRoles: SelectRoles = () => []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = req.headers.authorization;
      if (auth && auth.startsWith("Bearer")) {
        const token = auth.slice(7);

        const tokenData = verifyToken(token, "auth");

        const okRoles = selectRoles(ROLES);
        if (okRoles.length > 0) {
          const userRole = (
            await db.user.findFirst({
              where: { id: tokenData.id },
              select: { role: true },
            })
          )?.role;
          if (!userRole) throw new Exception(StatusCodes.UNAUTHORIZED);
          if (!okRoles.some((role) => (userRole & role) === role))
            throw new Exception(StatusCodes.FORBIDDEN);
        }

        req.user = tokenData;
        next();
      } else {
        throw new Exception(StatusCodes.UNAUTHORIZED);
      }
    } catch (err) {
      next(err);
    }
  };
