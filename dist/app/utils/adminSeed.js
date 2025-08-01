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
exports.adminSeed = void 0;
/* eslint-disable no-console */
const http_status_codes_1 = require("http-status-codes");
const env_1 = require("../config/env");
const appError_1 = require("../errors/appError");
const auth_model_1 = require("../modules/auth/auth.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_interface_1 = require("../modules/auth/auth.interface");
const adminSeed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield auth_model_1.User.findOne({ email: env_1.envVars.ADMIN_EMAIL });
        if (admin) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "Admin already exists");
        }
        const hashedPassword = yield bcrypt_1.default.hash(env_1.envVars.ADMIN_PASS, Number(env_1.envVars.SALT_ROUND));
        const payload = {
            name: "admin",
            email: env_1.envVars.ADMIN_EMAIL,
            password: hashedPassword,
            role: auth_interface_1.Role.ADMIN,
            phoneNumber: "01000000000",
        };
        yield auth_model_1.User.create(payload);
        console.log("Super admin create successfully");
    }
    catch (error) {
        console.log(error);
    }
});
exports.adminSeed = adminSeed;
