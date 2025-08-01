import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/appError";
import { getFare } from "../../utils/calculateFare";
import {
  getAddressFromCoordinates,
  getDistanceMatrix,
} from "../../utils/mapApi";
import { IRides, IRidesStatus } from "./rides.interface";
import { checkUserIsValid } from "../../utils/checkUserIsValid";
import { Rides } from "./rides.model";
import { Driver, User } from "../auth/auth.model";
import { Role } from "../auth/auth.interface";
import { updateRideTimes } from "../../utils/updateRideTImeStamp";
import { driverUpdateRide } from "./serviceHelper";

const requestRide = async (userId: string, payload: IRides) => {
  const otherRunningRide = await Rides.findOne({
    riderId: userId,
    status: { $ne: "completed" },
  }).limit(1);

  if (otherRunningRide) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `You already have an ride and status ${otherRunningRide.status.toUpperCase()}...Please wait for complete.`
    );
  }
  const user = await checkUserIsValid("_id", userId);
  const durationAndTime = await getDistanceMatrix(payload);

  if (!durationAndTime) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Sorry, we couldn't calculate the ride fare. Please try again later."
    );
  }

  // reserving pick up address
  const pickUpAddress = await getAddressFromCoordinates(
    payload.pickup.lat,
    payload.pickup.lng
  );
  // reserving destination up address
  const destinationAddress = await getAddressFromCoordinates(
    payload.destination.lat,
    payload.destination.lng
  );

  //   calculate total fare
  const totalFare = getFare(durationAndTime);

  const payloadDetails: IRides = {
    ...payload,
    riderId: user?._id,
    fare: totalFare,
    pickup_address: {
      label: pickUpAddress,
    },
    destinationAddress: {
      label: destinationAddress,
    },
    distance: durationAndTime?.distance,
    estimatedRideTime: durationAndTime?.duration / 60,
  };

  const ride = await Rides.create(payloadDetails);
  await User.findByIdAndUpdate(userId, { $push: { ride: ride?._id } });
  return ride;
};

const getMyRides = async (userId: string) => {
  const user = await User.findById(userId);

  let myRides;
  if (user?.role === Role.RIDER) {
    myRides = await Rides.find({ riderId: userId });
  } else if (user?.role === Role.DRIVER) {
    myRides = await Rides.find({ driverId: userId });
  } else {
    throw new AppError(StatusCodes.FORBIDDEN, "Invalid role");
  }

  return myRides;
};
const getAllRides = async (userId: string) => {
  const user = await User.findById(userId);

  const driver = await Driver.findOne({ userId: user?._id });
  if (user?.role === Role.DRIVER) {
    if (!driver?.isApproved) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Please verify your account then... try again"
      );
    }
    const rides = await Rides.find({ status: IRidesStatus.REQUESTED })
      .select("-pickup -destination -riderId")
      .populate("riderId", "name");

    return rides;
  }

  const rides = await Rides.find().populate("riderId", "-password");

  return rides;
};

const updateRide = async (userId: string, rideId: string, status: string) => {
  const user = await User.findById(userId);

  //   status lowercase
  const normalizedStatus = status.toLowerCase() as IRidesStatus;

  //   find ride
  const ride = await Rides.findById(rideId);
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }

  // if user is driver
  //**************

  if (status && user?.role === Role.DRIVER) {
    if (ride.status === "completed") {
      throw new AppError(StatusCodes.BAD_REQUEST, "Already completed");
    }
    await driverUpdateRide(normalizedStatus, rideId, userId);
  }

  //   if user is rider
  if (status && user?.role === Role.RIDER) {
    if (normalizedStatus !== "cancelled") {
      throw new AppError(StatusCodes.BAD_REQUEST, "invalid request");
    }
    const ride = await Rides.findById(rideId);
    if (ride?.status !== "requested") {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `You can't cancelled ride.Your ride status ${ride?.status}`
      );
    }

    ride.status = normalizedStatus;
    ride.rideTimeStamps.cancelledAt = new Date();
    await ride.save();
  }

  //   if user is admin
  ride.status = normalizedStatus;
  await updateRideTimes(rideId, normalizedStatus);
  await ride.save();
};

const getSingleRide = async (id: string) => {
  const ride = await Rides.findById(id)
    .populate({
      path: "riderId",
      select: "-password",
    })
    .populate({
      path: "driverId",
      select: "-password",
    });
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }

  return ride;
};
export const ridesServices = {
  requestRide,
  getMyRides,
  getAllRides,
  updateRide,
  getSingleRide,
};
