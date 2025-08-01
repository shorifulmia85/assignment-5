import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../auth/auth.interface";
import { driverController } from "./driver.controller";

const router = Router();

router.patch(
  "/approve/:id",
  checkAuth(Role.ADMIN),
  driverController.approvedDriverStatus
);
export const DriverRoutes = router;
