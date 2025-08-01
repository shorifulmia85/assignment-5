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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = require("http-status-codes");
const appError_1 = require("../../errors/appError");
const auth_model_1 = require("./auth.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
const generateToken_1 = require("../../utils/generateToken");
const auth_interface_1 = require("./auth.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield auth_model_1.User.findOne({ email: payload.email });
    if (isUserExists) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "User already exist");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, Number(env_1.envVars.SALT_ROUND));
    payload.password = hashedPassword;
    const user = yield auth_model_1.User.create(payload);
    return user;
});
const createDriver = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const isUserExists = yield auth_model_1.User.findOne({ email: payload.email });
        if (isUserExists) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "User already exist");
        }
        const hashedPassword = yield bcrypt_1.default.hash(payload.password, Number(env_1.envVars.SALT_ROUND));
        payload.password = hashedPassword;
        const user = yield auth_model_1.User.create([
            {
                name: payload === null || payload === void 0 ? void 0 : payload.name,
                email: payload === null || payload === void 0 ? void 0 : payload.email,
                phoneNumber: payload === null || payload === void 0 ? void 0 : payload.phoneNumber,
                password: hashedPassword,
                role: auth_interface_1.Role.DRIVER,
            },
        ], { session });
        yield auth_model_1.Driver.create([
            {
                userId: user === null || user === void 0 ? void 0 : user[0]._id,
                drivingLicense: payload === null || payload === void 0 ? void 0 : payload.drivingLicense,
                vehicleInfo: {
                    model: (_a = payload === null || payload === void 0 ? void 0 : payload.vehicleInfo) === null || _a === void 0 ? void 0 : _a.model,
                    license: (_b = payload === null || payload === void 0 ? void 0 : payload.vehicleInfo) === null || _b === void 0 ? void 0 : _b.license,
                },
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return user[0];
    }
    catch (error) {
        session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield auth_model_1.User.findOne({ email: payload.email });
    if (!isUserExists) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (isUserExists && isUserExists.status === "BLOCKED") {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Your account is blocked");
    }
    if (isUserExists && isUserExists.status === "INACTIVE") {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Your account is inactive,,, please contact our support team");
    }
    if (isUserExists && isUserExists.isDeleted) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Your account is deleted");
    }
    const comparePassword = yield bcrypt_1.default.compare(payload.password, isUserExists.password);
    if (!comparePassword) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password does not matched");
    }
    const tokenPayload = {
        userId: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role,
    };
    const accessToken = (0, generateToken_1.generateToken)(tokenPayload, env_1.envVars.jWT_SECRET, env_1.envVars.JWT_EXPIRES_IN);
    const refreshToken = (0, generateToken_1.generateToken)(tokenPayload, env_1.envVars.jWT_SECRET, env_1.envVars.JWT_EXPIRES_IN);
    return {
        accessToken,
        refreshToken,
    };
});
const changePassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById({ _id: userId });
    if (!user) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const comparePassword = yield bcrypt_1.default.compare(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!comparePassword) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password doesn't matched");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(env_1.envVars.SALT_ROUND));
    user.password = hashedPassword;
    yield user.save();
});
exports.authService = { createUser, login, createDriver, changePassword };
