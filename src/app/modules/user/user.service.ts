import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/appError";
import { Driver, User } from "../auth/auth.model";
import { checkUserIsValid } from "../../utils/checkUserIsValid";
import { IStatus } from "../auth/auth.interface";

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (user?.role === "DRIVER") {
    const driver = await Driver.findOne({ userId }).populate(
      "userId",
      "-password"
    );
    return driver;
  }
  return user;
};

const getAllUsers = async () => {
  const users = await User.find().select("-password");

  if (!users) {
    throw new AppError(StatusCodes.NOT_FOUND, "No users found");
  }
  return users;
};
const getSingleUser = async (id: string) => {
  const user = await checkUserIsValid("_id", id);
  return user;
};

const userStatusUpdate = async (
  userId: string,
  status: { status: IStatus }
) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  user.status = status.status;
  await user.save();

  return user;
};

export const userService = {
  getMe,
  getAllUsers,
  getSingleUser,
  userStatusUpdate,
};
