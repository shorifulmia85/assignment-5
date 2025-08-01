import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../auth/auth.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { userStatusUpdateAZodSchema } from "./user.validation";

const router = Router();
router.get("/me", checkAuth(...Object.values(Role)), userController.getMe);
router.get("/", checkAuth(Role.ADMIN), userController.getAllUsers);
router.get("/:id", checkAuth(Role.ADMIN), userController.getSingleUser);
router.patch(
  "/block/:id",
  checkAuth(Role.ADMIN),
  validateRequest(userStatusUpdateAZodSchema),
  userController.userStatusUpdate
);
export const UserRoutes = router;
