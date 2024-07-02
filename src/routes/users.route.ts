import { Router } from "express";
import { Groups, validateBody } from "../middlewares/validate-body.middleware";
import {
  signIn,
  signUp,
  verify,
  updateUser,
  userInfo,
} from "../controllers/users.controller";
import { UserModel } from "../models/user.model";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validateBody(UserModel, [Groups.CREATE]), signUp);
router.get("/register/verify/:token", verify);
router.post("/login", validateBody(UserModel, [Groups.AUTH]), signIn);
router.get("/me", authMiddleware(), userInfo);
router.put(
  "/:id/role",
  authMiddleware((roles) => [roles.ADMIN]),
  validateBody(UserModel, [Groups.UPDATE]),
  updateUser
);

export default router;
