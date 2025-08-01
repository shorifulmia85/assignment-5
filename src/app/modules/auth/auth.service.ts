/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/appError";
import { Driver, User } from "./auth.model";
import bcrypt from "bcrypt";
import { envVars } from "../../config/env";
import { generateToken } from "../../utils/generateToken";
import { IUser, IUserWithDriver, Role } from "./auth.interface";
import mongoose from "mongoose";

const createUser = async (payload: IUser) => {
  const isUserExists = await User.findOne({ email: payload.email });
  if (isUserExists) {
    throw new AppError(StatusCodes.CONFLICT, "User already exist");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(envVars.SALT_ROUND)
  );

  payload.password = hashedPassword;

  const user = await User.create(payload);
  return user;
};

const createDriver = async (payload: IUserWithDriver) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const isUserExists = await User.findOne({ email: payload.email });

    if (isUserExists) {
      throw new AppError(StatusCodes.CONFLICT, "User already exist");
    }

    const hashedPassword = await bcrypt.hash(
      payload.password,
      Number(envVars.SALT_ROUND)
    );
    payload.password = hashedPassword;

    const user = await User.create(
      [
        {
          name: payload?.name,
          email: payload?.email,
          phoneNumber: payload?.phoneNumber,
          password: hashedPassword,
          role: Role.DRIVER,
        },
      ],
      { session }
    );

    await Driver.create(
      [
        {
          userId: user?.[0]._id,
          drivingLicense: payload?.drivingLicense,
          vehicleInfo: {
            model: payload?.vehicleInfo?.model,
            license: payload?.vehicleInfo?.license,
          },
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return user[0];
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const login = async (payload: { email: string; password: string }) => {
  const isUserExists = await User.findOne({ email: payload.email });
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (isUserExists && isUserExists.status === "BLOCKED") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Your account is blocked");
  }

  if (isUserExists && isUserExists.status === "INACTIVE") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Your account is inactive,,, please contact our support team"
    );
  }
  if (isUserExists && isUserExists.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Your account is deleted");
  }

  const comparePassword = await bcrypt.compare(
    payload.password,
    isUserExists.password
  );
  if (!comparePassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password does not matched");
  }

  const tokenPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };
  const accessToken = generateToken(
    tokenPayload,
    envVars.jWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );
  const refreshToken = generateToken(
    tokenPayload,
    envVars.jWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userId: string,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const user = await User.findById({ _id: userId });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  const comparePassword = await bcrypt.compare(
    payload.oldPassword,
    user?.password as string
  );

  if (!comparePassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password doesn't matched");
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(envVars.SALT_ROUND)
  );
  user.password = hashedPassword;
  await user.save();
};

export const authService = { createUser, login, createDriver, changePassword };
