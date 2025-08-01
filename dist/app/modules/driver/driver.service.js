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
exports.driverService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = require("../../errors/appError");
const checkUserIsValid_1 = require("../../utils/checkUserIsValid");
const auth_model_1 = require("../auth/auth.model");
const approvedDriverStatus = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, checkUserIsValid_1.checkUserIsValid)("_id", userId);
    const driver = yield auth_model_1.Driver.findOne({ userId: user === null || user === void 0 ? void 0 : user._id });
    if (!driver) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Your vehicle details incomplete...please contact our support team");
    }
    driver.isApproved = true;
    yield driver.save();
});
exports.driverService = {
    approvedDriverStatus,
};
