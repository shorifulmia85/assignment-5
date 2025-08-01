import { Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const user = await userService.getMe(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Get my profile successfully",
    data: user,
  });
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All users get successfully",
    data: user,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await userService.getSingleUser(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Single user get successfully",
    data: user,
  });
});
const userStatusUpdate = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await userService.userStatusUpdate(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `${user?.status.toLowerCase()} successfully`,
    data: user,
  });
});
export const userController = {
  getMe,
  getAllUsers,
  getSingleUser,
  userStatusUpdate,
};
