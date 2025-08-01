import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { DriverRoutes } from "../modules/driver/driver.route";
import { RidesRoutes } from "../modules/rides/rides.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/drivers",
    route: DriverRoutes,
  },
  {
    path: "/rides",
    route: RidesRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
