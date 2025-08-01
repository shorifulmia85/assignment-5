import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";
import { authCookie, clearCookie } from "../../utils/authCookie";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "User created successfully",
    data: user,
  });
});

const createDriver = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.createDriver(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Account created successfully",
    data: user,
  });
});
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  authCookie(res, result);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "logged in successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const user = await authService.changePassword(userId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Password change successfully",
    data: user,
  });
});

const logOut = catchAsync(async (req: Request, res: Response) => {
  await clearCookie(res, "accessToken");
  await clearCookie(res, "refreshToken");

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Log out successfully",
    data: null,
  });
});

export const authController = {
  createUser,
  login,
  createDriver,
  changePassword,
  logOut,
};
