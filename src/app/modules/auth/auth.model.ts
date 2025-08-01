import { model, Schema } from "mongoose";
import { IDriver, IStatus, IUser, Role } from "./auth.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.RIDER },
    status: {
      type: String,
      enum: Object.values(IStatus),
      default: IStatus.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    ride: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rides",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const User = model<IUser>("User", userSchema);

const driverSchema = new Schema<IDriver>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isApproved: { type: Boolean, required: true, default: false },
    isAvailable: { type: Boolean, required: true, default: false },
    drivingLicense: { type: String, required: true },
    totalEarnings: { type: Number, default: 0 },
    vehicleInfo: {
      model: { type: String, required: true },
      license: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export const Driver = model<IDriver>("Driver", driverSchema);
