"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStatusUpdateAZodSchema = void 0;
const zod_1 = require("zod");
const auth_interface_1 = require("../auth/auth.interface");
exports.userStatusUpdateAZodSchema = zod_1.z.object({
    status: zod_1.z.enum(auth_interface_1.IStatus, {
        error: (issue) => issue.code === undefined
            ? "Please select one of: ACTIVE, INACTIVE, BLOCKED"
            : "isActive must be enum value",
    }),
});
