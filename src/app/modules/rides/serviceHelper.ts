import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/appError";
import { Driver, User } from "../auth/auth.model";
import { Rides } from "./rides.model";
import { updateRideTimes } from "../../utils/updateRideTImeStamp";
import { Types } from "mongoose";
import { IRidesStatus } from "./rides.interface";

export const driverUpdateRide = async (
  status: string,
  rideId: string,
  userId: string
) => {
  // DRIVER COLLECTION WORK
  const driver = await Driver.findOne({ userId });
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver info not found");
  }
  const ride = await Rides.findById(rideId);
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }

  if (!driver.isApproved && !driver?.isAvailable) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please verify your account then... try again"
    );
  }
  if (!driver.isAvailable) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please update your available status Online"
    );
  }

  //   RIDES COLLECTION WORK
  // if drive in time multiple ride accepted
  const runningStatuses = ["accepted", "picked_up", "in_transit"];
  const otherRunningRide = await Rides.findOne({
    driverId: userId,
    status: { $in: runningStatuses },
    _id: { $ne: ride?._id },
  });

  if (otherRunningRide) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `You already have a ${otherRunningRide.status.toUpperCase()} ride. Please complete it first.`
    );
  }

  const allowedStatuses = ["accepted", "picked_up", "in_transit", "completed"];

  // input not includes throw an error
  if (!allowedStatuses.includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid status");
  }

  // if input but not accepted throw this error
  if (
    status === "picked_up" ||
    status === "in_transit" ||
    status === "completed"
  ) {
    if (!ride.driverId || !ride.driverId.equals(userId)) {
      throw new AppError(403, "You are not authorized ");
    }
  }

  if (status === "completed") {
    if (ride.status === "completed") {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Ride already complete,,, You can see another ride"
      );
    }

    driver.totalEarnings = Number(driver?.totalEarnings) + Number(ride.fare);
    await driver.save();
  }

  await updateRideTimes(ride?._id, status);
  await User.findByIdAndUpdate(userId, { $push: { ride: ride?._id } });

  ride.status = status as IRidesStatus;
  ride.driverId = new Types.ObjectId(userId);
  await ride.save();
};
