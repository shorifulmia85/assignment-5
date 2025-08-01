import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/appError";
import { checkUserIsValid } from "../../utils/checkUserIsValid";
import { Driver, User } from "../auth/auth.model";

const approvedDriverStatus = async (userId: string) => {
  const user = await checkUserIsValid("_id", userId);
  const driver = await Driver.findOne({ userId: user?._id });
  if (!driver) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Your vehicle details incomplete...please contact our support team"
    );
  }
  driver.isApproved = true;
  await driver.save();
};

const setAvailable = async (userId: string) => {
  const driver = await Driver.findOne({ userId });
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
  }
  driver.isAvailable = !driver.isAvailable;
  await driver.save();
};

export const driverService = {
  approvedDriverStatus,
  setAvailable,
};
