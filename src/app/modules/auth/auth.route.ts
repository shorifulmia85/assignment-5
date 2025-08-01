import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import {
  changePasswordZodSchema,
  createDriverZodSchema,
  createUserZodSchema,
  loginZodSchema,
} from "./auth.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./auth.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  authController.createUser
);
router.post(
  "/register-driver",
  validateRequest(createDriverZodSchema),
  authController.createDriver
);

router.post("/login", validateRequest(loginZodSchema), authController.login);
router.post(
  "/change-password",
  checkAuth(Role.RIDER),
  validateRequest(changePasswordZodSchema),
  authController.changePassword
);

router.post("/logout", authController.logOut);
export const AuthRoutes = router;
