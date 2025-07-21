import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

// Cookie config helper
const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 10 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// @route POST /api/v1/auth/register
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, token, refreshToken } = await AuthService.register(req.body);

    setAuthCookies(res, token, refreshToken);

    res.status(201).json({
      message: "User created successfully",
      user_id: user._id,
      user_name: user.first_name,
      user_type: user.user_type,
    });
  }
);

// @route POST /api/v1/auth/login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token, refreshToken } = await AuthService.login(
    email,
    password
  );

  setAuthCookies(res, token, refreshToken);

  res.status(200).json({
    message: "Login successful",
    user_id: user._id,
    user_name: user.first_name,
    user_type: user.user_type,
  });
});

// @route PUT /api/v1/auth/refresh-token
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401).json({ message: "No refresh token provided" });
      return;
    }
    try {
      const accessToken = AuthService.refreshAccessToken(token);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({ message: "Access token refreshed" });
    } catch {
      res.status(403).json({ message: "Invalid or expired refresh token" });
    }
  }
);

// @route POST /api/v1/auth/logout
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Logged out successfully" });
});

// @route GET /api/v1/auth/me
export const getMe = asyncHandler(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    res.status(200).json({
      user_id: user._id,
      user_name: user.first_name,
      user_type: user.user_type,
    });
  }
);
