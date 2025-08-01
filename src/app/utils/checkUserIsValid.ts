import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/appError";
import { User } from "../modules/auth/auth.model";

export const checkUserIsValid = async (CField: string, value: string) => {
  const payload = {
    [CField]: value,
  };

  let user;
  if (CField === "_id") {
    user = await User.findById(payload).select("-password");
  }
  user = await User.findOne(payload).select("-password");

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user && user.status === "BLOCKED") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Your account is blocked");
  }
  if (user && user.status === "INACTIVE") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Your account paused...because you're long inactive"
    );
  }
  if (user && user.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Your account is deleted");
  }

  return user;
};
