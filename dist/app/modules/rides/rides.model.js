"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rides = void 0;
const mongoose_1 = require("mongoose");
const rides_interface_1 = require("./rides.interface");
const rideSchema = new mongoose_1.Schema({
    riderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    pickup: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    destination: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    pickup_address: {
        label: { type: String, required: true },
    },
    destinationAddress: {
        label: { type: String, required: true },
    },
    status: {
        type: String,
        enum: Object.values(rides_interface_1.IRidesStatus),
        default: rides_interface_1.IRidesStatus.REQUESTED,
    },
    distance: { type: Number, required: true },
    estimatedRideTime: { type: Number, required: true },
    rideTimeStamps: {
        requestedAt: { type: Date, default: Date.now },
        acceptedAt: { type: Date },
        pickedUpAt: { type: Date },
        completedAt: { type: Date },
        cancelledAt: { type: Date },
    },
    fare: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
exports.Rides = (0, mongoose_1.model)("Rides", rideSchema);
