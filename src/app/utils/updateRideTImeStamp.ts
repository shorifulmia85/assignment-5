import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/appError";
import { Rides } from "../modules/rides/rides.model";
import { Types } from "mongoose";

export const updateRideTimes = async (
  rideId: Types.ObjectId | string,
  status: string
) => {
  const ride = await Rides.findById(rideId);
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }
  const now = new Date();
  switch (status) {
    case "accepted":
      ride.rideTimeStamps.acceptedAt = now;
      break;
    case "picked_up":
      ride.rideTimeStamps.pickedUpAt = now;
      break;
    case "in_transit":
      ride.rideTimeStamps.in_transit = now;
      break;
    case "completed":
      ride.rideTimeStamps.completedAt = now;
      break;

    default:
      break;
  }
};
