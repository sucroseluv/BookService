import { Request, Response, NextFunction } from "express";
import { Groups } from "./validate-body.middleware";
import { instanceToPlain } from "class-transformer";

export function responseWrapper(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.sendInst = <T>(body: T | T[], groups: string[] = [Groups.READ]) => {
    res.json(transform(body, groups));
  };
  next();
}

function transform<T>(body: T | T[], groups: string[]) {
  return Array.isArray(body)
    ? body.map((item) =>
        instanceToPlain(item, { groups, excludeExtraneousValues: true })
      )
    : instanceToPlain(body, { groups, excludeExtraneousValues: true });
}
