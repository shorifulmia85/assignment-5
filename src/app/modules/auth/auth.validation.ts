import { z } from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, { message: "Name can be maximum 20 characters" }),

  email: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Email must be a string",
    })
    .email("Invalid email address"),

  password: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Password is required"
        : "Password must be a string",
  }),

  phoneNumber: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Phone number is required"
        : "Phone number must be a string",
  }),
});

export const createDriverZodSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, { message: "Name can be maximum 20 characters" }),

  email: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Email must be a string",
    })
    .email("Invalid email address"),

  password: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Password is required"
        : "Password must be a string",
  }),

  phoneNumber: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Phone number is required"
        : "Phone number must be a string",
  }),
  drivingLicense: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "driving license is required"
        : "driving license must be a string",
  }),
  vehicleInfo: z.object({
    model: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "vehicle model is required"
          : "vehicle model must be a string",
    }),
    license: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "vehicle license is required"
          : "vehicle license must be a string",
    }),
  }),
});

export const loginZodSchema = z.object({
  email: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Email must be a string",
    })
    .email("Invalid email address"),

  password: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Password is required"
        : "Password must be a string",
  }),
});

export const changePasswordZodSchema = z.object({
  oldPassword: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Old password is required"
        : "Old password must be a string",
  }),
  newPassword: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "New password is required"
        : "New password must be a string",
  }),
});
