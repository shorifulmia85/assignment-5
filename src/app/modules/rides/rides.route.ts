import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../auth/auth.interface";
import { ridesController } from "./rides.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { requestedRideZodSchema, updateRide } from "./rides.validation";

const router = Router();
router.get(
  "/me",
  checkAuth(Role.RIDER, Role.DRIVER),
  ridesController.getMyRides
);
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.DRIVER),
  ridesController.getAllRides
);
router.get("/:id", checkAuth(Role.ADMIN), ridesController.getSingleRide);
router.post(
  "/requested",
  checkAuth(Role.RIDER),
  validateRequest(requestedRideZodSchema),
  ridesController.requestRide
);

router.patch(
  "/:id/status",
  checkAuth(...Object.values(Role)),
  validateRequest(updateRide),
  ridesController.updateRide
);
export const RidesRoutes = router;
