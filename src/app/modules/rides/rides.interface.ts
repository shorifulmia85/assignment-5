import { Types } from "mongoose";

export enum IRidesStatus {
  REQUESTED = "requested",
  ACCEPTED = "accepted",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface IRides {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId | null;
  pickup: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  pickup_address: {
    label: string;
  };
  destinationAddress: {
    label: string;
  };
  distance: number;
  estimatedRideTime: number;
  status: IRidesStatus;
  rideTimeStamps: {
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    in_transit?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
  fare: number;
}
