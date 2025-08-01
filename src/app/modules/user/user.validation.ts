import { z } from "zod";
import { IStatus } from "../auth/auth.interface";

export const userStatusUpdateAZodSchema = z.object({
  status: z.enum(IStatus, {
    error: (issue) =>
      issue.code === undefined
        ? "Please select one of: ACTIVE, INACTIVE, BLOCKED"
        : "isActive must be enum value",
  }),
});
