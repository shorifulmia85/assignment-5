import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ridesServices } from "./rides.service";

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await ridesServices.requestRide(userId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Ride requested successful",
    data: result,
  });
});
const getMyRides = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await ridesServices.getMyRides(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "My rides get successful",
    data: result,
  });
});
const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await ridesServices.getAllRides(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "All rides get successful",
    data: result,
  });
});
const updateRide = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const rideId = req.params.id;
  const result = await ridesServices.updateRide(
    userId,
    rideId,
    req.body.status
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Ride update successful",
    data: result,
  });
});

const getSingleRide = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const result = await ridesServices.getSingleRide(rideId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Ride get successful",
    data: result,
  });
});
export const ridesController = {
  requestRide,
  getMyRides,
  getAllRides,
  updateRide,
  getSingleRide,
};
