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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const appError_1 = require("../errors/appError");
const http_status_codes_1 = require("http-status-codes");
const verifyToken_1 = require("../utils/verifyToken");
const env_1 = require("../config/env");
const checkUserIsValid_1 = require("../utils/checkUserIsValid");
const checkAuth = (...roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "No accessToken provide");
        }
        const verifiedToken = (0, verifyToken_1.verifyToken)(accessToken, env_1.envVars.jWT_SECRET);
        yield (0, checkUserIsValid_1.checkUserIsValid)("email", verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.email);
        if (!roles.includes(verifiedToken.role)) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "unauthorized");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.checkAuth = checkAuth;
