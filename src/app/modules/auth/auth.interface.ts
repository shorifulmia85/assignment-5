import { Types } from "mongoose";

export enum Role {
  RIDER = "RIDER",
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
}

export enum IStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
  isDeleted: boolean;
  status: IStatus;
  ride?: Types.ObjectId[];
}

export interface IDriver {
  userId: Types.ObjectId;
  isApproved: boolean;
  isAvailable: boolean;
  drivingLicense: string;
  vehicleInfo: {
    model: string;
    license: string;
  };
  totalEarnings: number;
}

export interface IUserWithDriver {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  drivingLicense: string;
  vehicleInfo: {
    model: string;
    license: string;
  };
}
