import dotenv from "dotenv";
dotenv.config();

interface IEnvConfig {
  DB_URL: string;
  PORT: string;
  NODE_ENV: string;
  SALT_ROUND: string;
  ADMIN_EMAIL: string;
  ADMIN_PASS: string;
  jWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  jWT_REFRESH_SECRET: string;
  jWT_REFRESH_EXPIRES_IN: string;
  ORS_API_KEY: string;
  HEIGIT_MATRIX_API: string;
  HEIGIT_REVERSE_API: string;
}

const loadEnvVariable = (): IEnvConfig => {
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
    DB_URL: process.env.DB_URL as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    SALT_ROUND: process.env.SALT_ROUND as string,
    jWT_SECRET: process.env.jWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    jWT_REFRESH_SECRET: process.env.jWT_REFRESH_SECRET as string,
    jWT_REFRESH_EXPIRES_IN: process.env.jWT_REFRESH_EXPIRES_IN as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASS: process.env.ADMIN_PASS as string,
    ORS_API_KEY: process.env.ORS_API_KEY as string,
    HEIGIT_MATRIX_API: process.env.HEIGIT_MATRIX_API as string,
    HEIGIT_REVERSE_API: process.env.HEIGIT_REVERSE_API as string,
  };
};

export const envVars = loadEnvVariable();
