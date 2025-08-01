import { Response } from "express";
import { envVars } from "../config/env";

interface authToken {
  accessToken: string;
  refreshToken: string;
}
export const authCookie = (res: Response, token: authToken) => {
  if (token.accessToken) {
    res.cookie("accessToken", token.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: envVars.NODE_ENV === "development",
    });
  }
  if (token.refreshToken) {
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: envVars.NODE_ENV === "development",
    });
  }
};
export const clearCookie = async (res: Response, tokenName: string) => {
  res.clearCookie(tokenName, {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: "lax",
  });
};
