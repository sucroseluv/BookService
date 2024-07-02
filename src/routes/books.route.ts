import { Router } from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/books.controller";
import { Groups, validateBody } from "../middlewares/validate-body.middleware";
import { BookModel } from "../models/book.model";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAll);
router.get("/:id", getOne);

router.post(
  "/",
  authMiddleware((roles) => [roles.ADMIN]),
  validateBody(BookModel, [Groups.CREATE]),
  create
);
router.put(
  "/:id",
  authMiddleware((roles) => [roles.ADMIN]),
  validateBody(BookModel, [Groups.UPDATE]),
  update
);
router.delete(
  "/:id",
  authMiddleware((roles) => [roles.ADMIN]),
  remove
);

export default router;
