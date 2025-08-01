/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import { envVars } from "../config/env";
import { AppError } from "../errors/appError";
import { User } from "../modules/auth/auth.model";
import bcrypt from "bcrypt";
import { Role } from "../modules/auth/auth.interface";

export const adminSeed = async () => {
  try {
    const admin = await User.findOne({ email: envVars.ADMIN_EMAIL });
    if (admin) {
      throw new AppError(StatusCodes.CONFLICT, "Admin already exists");
    }
    const hashedPassword = await bcrypt.hash(
      envVars.ADMIN_PASS,
      Number(envVars.SALT_ROUND)
    );

    const payload = {
      name: "admin",
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.ADMIN,
      phoneNumber: "01000000000",
    };

    await User.create(payload);
    console.log("Super admin create successfully");
  } catch (error) {
    console.log(error);
  }
};
