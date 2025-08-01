import { Schema, model } from "mongoose";
import { IRides, IRidesStatus } from "./rides.interface";

const rideSchema = new Schema<IRides>(
  {
    riderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
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
      enum: Object.values(IRidesStatus),
      default: IRidesStatus.REQUESTED,
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
  },
  {
    timestamps: true,
  }
);

export const Rides = model<IRides>("Rides", rideSchema);
