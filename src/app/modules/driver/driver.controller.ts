import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { driverService } from "./driver.service";

const approvedDriverStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const result = await driverService.approvedDriverStatus(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `approved successful`,
    data: result,
  });
});
export const driverController = { approvedDriverStatus };
