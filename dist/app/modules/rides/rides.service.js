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
exports.ridesServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = require("../../errors/appError");
const calculateFare_1 = require("../../utils/calculateFare");
const mapApi_1 = require("../../utils/mapApi");
const rides_interface_1 = require("./rides.interface");
const checkUserIsValid_1 = require("../../utils/checkUserIsValid");
const rides_model_1 = require("./rides.model");
const auth_model_1 = require("../auth/auth.model");
const auth_interface_1 = require("../auth/auth.interface");
const updateRideTImeStamp_1 = require("../../utils/updateRideTImeStamp");
const serviceHelper_1 = require("./serviceHelper");
const requestRide = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const otherRunningRide = yield rides_model_1.Rides.findOne({
        riderId: userId,
        status: { $ne: "completed" },
    }).limit(1);
    if (otherRunningRide) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, `You already have an ride and status ${otherRunningRide.status.toUpperCase()}...Please wait for complete.`);
    }
    const user = yield (0, checkUserIsValid_1.checkUserIsValid)("_id", userId);
    const durationAndTime = yield (0, mapApi_1.getDistanceMatrix)(payload);
    if (!durationAndTime) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Sorry, we couldn't calculate the ride fare. Please try again later.");
    }
    // reserving pick up address
    const pickUpAddress = yield (0, mapApi_1.getAddressFromCoordinates)(payload.pickup.lat, payload.pickup.lng);
    // reserving destination up address
    const destinationAddress = yield (0, mapApi_1.getAddressFromCoordinates)(payload.destination.lat, payload.destination.lng);
    //   calculate total fare
    const totalFare = (0, calculateFare_1.getFare)(durationAndTime);
    const payloadDetails = Object.assign(Object.assign({}, payload), { riderId: user === null || user === void 0 ? void 0 : user._id, fare: totalFare, pickup_address: {
            label: pickUpAddress,
        }, destinationAddress: {
            label: destinationAddress,
        }, distance: durationAndTime === null || durationAndTime === void 0 ? void 0 : durationAndTime.distance, estimatedRideTime: (durationAndTime === null || durationAndTime === void 0 ? void 0 : durationAndTime.duration) / 60 });
    const ride = yield rides_model_1.Rides.create(payloadDetails);
    yield auth_model_1.User.findByIdAndUpdate(userId, { $push: { ride: ride === null || ride === void 0 ? void 0 : ride._id } });
    return ride;
});
const getMyRides = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(userId);
    let myRides;
    if ((user === null || user === void 0 ? void 0 : user.role) === auth_interface_1.Role.RIDER) {
        myRides = yield rides_model_1.Rides.find({ riderId: userId });
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === auth_interface_1.Role.DRIVER) {
        myRides = yield rides_model_1.Rides.find({ driverId: userId });
    }
    else {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Invalid role");
    }
    return myRides;
});
const getAllRides = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(userId);
    const driver = yield auth_model_1.Driver.findOne({ userId: user === null || user === void 0 ? void 0 : user._id });
    if ((user === null || user === void 0 ? void 0 : user.role) === auth_interface_1.Role.DRIVER) {
        if (!(driver === null || driver === void 0 ? void 0 : driver.isApproved)) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Please verify your account then... try again");
        }
        const rides = yield rides_model_1.Rides.find({ status: rides_interface_1.IRidesStatus.REQUESTED })
            .select("-pickup -destination -riderId")
            .populate("riderId", "name");
        return rides;
    }
    const rides = yield rides_model_1.Rides.find().populate("riderId", "-password");
    return rides;
});
const updateRide = (userId, rideId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(userId);
    //   status lowercase
    const normalizedStatus = status.toLowerCase();
    //   find ride
    const ride = yield rides_model_1.Rides.findById(rideId);
    if (!ride) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    }
    // if user is driver
    //**************
    if (status && (user === null || user === void 0 ? void 0 : user.role) === auth_interface_1.Role.DRIVER) {
        if (ride.status === "completed") {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Already completed");
        }
        yield (0, serviceHelper_1.driverUpdateRide)(normalizedStatus, rideId, userId);
    }
    //   if user is rider
    if (status && (user === null || user === void 0 ? void 0 : user.role) === auth_interface_1.Role.RIDER) {
        if (normalizedStatus !== "cancelled") {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "invalid request");
        }
        const ride = yield rides_model_1.Rides.findById(rideId);
        if ((ride === null || ride === void 0 ? void 0 : ride.status) !== "requested") {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, `You can't cancelled ride.Your ride status ${ride === null || ride === void 0 ? void 0 : ride.status}`);
        }
        ride.status = normalizedStatus;
        ride.rideTimeStamps.cancelledAt = new Date();
        yield ride.save();
    }
    //   if user is admin
    ride.status = normalizedStatus;
    yield (0, updateRideTImeStamp_1.updateRideTimes)(rideId, normalizedStatus);
    yield ride.save();
});
const getSingleRide = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield rides_model_1.Rides.findById(id)
        .populate({
        path: "riderId",
        select: "-password",
    })
        .populate({
        path: "driverId",
        select: "-password",
    });
    if (!ride) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    }
    return ride;
});
exports.ridesServices = {
    requestRide,
    getMyRides,
    getAllRides,
    updateRide,
    getSingleRide,
};
