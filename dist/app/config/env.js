"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariable = () => {
    const requiredValue = [
        "DB_URL",
        "PORT",
        "NODE_ENV",
        "SALT_ROUND",
        "ADMIN_EMAIL",
        "jWT_SECRET",
        "JWT_EXPIRES_IN",
        "jWT_REFRESH_SECRET",
        "jWT_REFRESH_EXPIRES_IN",
        "ADMIN_PASS",
        "ORS_API_KEY",
        "HEIGIT_MATRIX_API",
        "HEIGIT_REVERSE_API",
    ];
    requiredValue.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing env variables ${key}`);
        }
    });
    return {
        DB_URL: process.env.DB_URL,
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        SALT_ROUND: process.env.SALT_ROUND,
        jWT_SECRET: process.env.jWT_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        jWT_REFRESH_SECRET: process.env.jWT_REFRESH_SECRET,
        jWT_REFRESH_EXPIRES_IN: process.env.jWT_REFRESH_EXPIRES_IN,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASS: process.env.ADMIN_PASS,
        ORS_API_KEY: process.env.ORS_API_KEY,
        HEIGIT_MATRIX_API: process.env.HEIGIT_MATRIX_API,
        HEIGIT_REVERSE_API: process.env.HEIGIT_REVERSE_API,
    };
};
exports.envVars = loadEnvVariable();
