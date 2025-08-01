"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverUpdateRide = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = require("../../errors/appError");
const auth_model_1 = require("../auth/auth.model");
const rides_model_1 = require("./rides.model");
const updateRideTImeStamp_1 = require("../../utils/updateRideTImeStamp");
const mongoose_1 = require("mongoose");
const driverUpdateRide = (status, rideId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // DRIVER COLLECTION WORK
    const driver = yield auth_model_1.Driver.findOne({ userId });
    if (!driver) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver info not found");
    }
    const ride = yield rides_model_1.Rides.findById(rideId);
    if (!ride) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    }
    if (!driver.isApproved) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Please verify your account then... try again");
    }
    if (!driver.isAvailable) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Please update your available status Online");
    }
    //   RIDES COLLECTION WORK
    // if drive in time multiple ride accepted
    const runningStatuses = ["accepted", "picked_up", "in_transit"];
    const otherRunningRide = yield rides_model_1.Rides.findOne({
        driverId: userId,
        status: { $in: runningStatuses },
        _id: { $ne: ride === null || ride === void 0 ? void 0 : ride._id },
    });
    if (otherRunningRide) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, `You already have a ${otherRunningRide.status.toUpperCase()} ride. Please complete it first.`);
    }
    const allowedStatuses = ["accepted", "picked_up", "in_transit", "completed"];
    // input not includes throw an error
    if (!allowedStatuses.includes(status)) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid status");
    }
    // if input but not accepted throw this error
    if (status === "picked_up" ||
        status === "in_transit" ||
        status === "completed") {
        if (!ride.driverId || !ride.driverId.equals(userId)) {
            throw new appError_1.AppError(403, "You are not authorized ");
        }
    }
    if (status === "completed") {
        if (ride.status === "completed") {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Ride already complete,,, You can see another ride");
        }
        driver.totalEarnings = Number(driver === null || driver === void 0 ? void 0 : driver.totalEarnings) + Number(ride.fare);
        yield driver.save();
    }
    yield (0, updateRideTImeStamp_1.updateRideTimes)(ride === null || ride === void 0 ? void 0 : ride._id, status);
    yield auth_model_1.User.findByIdAndUpdate(userId, { $push: { ride: ride === null || ride === void 0 ? void 0 : ride._id } });
    ride.status = status;
    ride.driverId = new mongoose_1.Types.ObjectId(userId);
    yield ride.save();
});
exports.driverUpdateRide = driverUpdateRide;
