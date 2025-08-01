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
exports.updateRideTimes = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = require("../errors/appError");
const rides_model_1 = require("../modules/rides/rides.model");
const updateRideTimes = (rideId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield rides_model_1.Rides.findById(rideId);
    if (!ride) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
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
});
exports.updateRideTimes = updateRideTimes;
