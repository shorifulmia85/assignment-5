"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordZodSchema = exports.loginZodSchema = exports.createDriverZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Name is required"
            : "Name must be a string",
    })
        .min(3, { message: "Name must be at least 3 characters" })
        .max(20, { message: "Name can be maximum 20 characters" }),
    email: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Email is required"
            : "Email must be a string",
    })
        .email("Invalid email address"),
    password: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
    }),
    phoneNumber: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Phone number is required"
            : "Phone number must be a string",
    }),
});
exports.createDriverZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Name is required"
            : "Name must be a string",
    })
        .min(3, { message: "Name must be at least 3 characters" })
        .max(20, { message: "Name can be maximum 20 characters" }),
    email: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Email is required"
            : "Email must be a string",
    })
        .email("Invalid email address"),
    password: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
    }),
    phoneNumber: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Phone number is required"
            : "Phone number must be a string",
    }),
    drivingLicense: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "driving license is required"
            : "driving license must be a string",
    }),
    vehicleInfo: zod_1.z.object({
        model: zod_1.z.string({
            error: (issue) => issue.input === undefined
                ? "vehicle model is required"
                : "vehicle model must be a string",
        }),
        license: zod_1.z.string({
            error: (issue) => issue.input === undefined
                ? "vehicle license is required"
                : "vehicle license must be a string",
        }),
    }),
});
exports.loginZodSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Email is required"
            : "Email must be a string",
    })
        .email("Invalid email address"),
    password: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
    }),
});
exports.changePasswordZodSchema = zod_1.z.object({
    oldPassword: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Old password is required"
            : "Old password must be a string",
    }),
    newPassword: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "New password is required"
            : "New password must be a string",
    }),
});
