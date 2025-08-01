/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from "zod";

// Enum constant
export const RidesStatusEnum = z.enum([
  "REQUESTED",
  "ACCEPTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "COMPLETED",
  "CANCELLED",
]);

export const requestedRideZodSchema = z.object({
  pickup: z.object({
    lat: z.number({
      error: (issue) =>
        issue.input === undefined
          ? "Pickup latitude is required"
          : "Pickup latitude must be a number",
    }),
    lng: z.number({
      error: (issue) =>
        issue.input === undefined
          ? "Pickup longitude is required"
          : "Pickup longitude must be a number",
    }),
  }),

  destination: z.object({
    lat: z.number({
      error: (issue) =>
        issue.input === undefined
          ? "Destination latitude is required"
          : "Destination latitude must be a number",
    }),
    lng: z.number({
      error: (issue) =>
        issue.input === undefined
          ? "Destination longitude is required"
          : "Destination longitude must be a number",
    }),
  }),

  fare: z
    .number({ error: (issue) => "Fare must be a number" })
    .nonnegative({ message: "Fare cannot be negative" })
    .optional(),
});

export const updateRide = z.object({
  status: RidesStatusEnum.refine(
    (val) =>
      [
        "ACCEPTED",
        "PICKED_UP",
        "IN_TRANSIT",
        "COMPLETED",
        "CANCELLED",
      ].includes(val),
    {
      message: "Invalid ride status",
    }
  ),
});
