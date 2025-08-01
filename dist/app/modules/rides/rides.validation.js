"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRide = exports.requestedRideZodSchema = exports.RidesStatusEnum = void 0;
const zod_1 = require("zod");
// Enum constant
exports.RidesStatusEnum = zod_1.z.enum([
    "REQUESTED",
    "ACCEPTED",
    "PICKED_UP",
    "IN_TRANSIT",
    "COMPLETED",
    "CANCELLED",
]);
exports.requestedRideZodSchema = zod_1.z.object({
    pickup: zod_1.z.object({
        lat: zod_1.z.number({
            error: (issue) => issue.input === undefined
                ? "Pickup latitude is required"
                : "Pickup latitude must be a number",
        }),
        lng: zod_1.z.number({
            error: (issue) => issue.input === undefined
                ? "Pickup longitude is required"
                : "Pickup longitude must be a number",
        }),
    }),
    destination: zod_1.z.object({
        lat: zod_1.z.number({
            error: (issue) => issue.input === undefined
                ? "Destination latitude is required"
                : "Destination latitude must be a number",
        }),
        lng: zod_1.z.number({
            error: (issue) => issue.input === undefined
                ? "Destination longitude is required"
                : "Destination longitude must be a number",
        }),
    }),
    fare: zod_1.z
        .number({ error: (issue) => "Fare must be a number" })
        .nonnegative({ message: "Fare cannot be negative" })
        .optional(),
});
exports.updateRide = zod_1.z.object({
    status: exports.RidesStatusEnum.refine((val) => [
        "ACCEPTED",
        "PICKED_UP",
        "IN_TRANSIT",
        "COMPLETED",
        "CANCELLED",
    ].includes(val), {
        message: "Invalid ride status",
    }),
});
