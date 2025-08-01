"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = exports.User = void 0;
const mongoose_1 = require("mongoose");
const auth_interface_1 = require("./auth.interface");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: Object.values(auth_interface_1.Role), default: auth_interface_1.Role.RIDER },
    status: {
        type: String,
        enum: Object.values(auth_interface_1.IStatus),
        default: auth_interface_1.IStatus.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    ride: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Rides",
        },
    ],
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
const driverSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
