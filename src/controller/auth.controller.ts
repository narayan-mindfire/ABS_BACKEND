import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

// @route POST /api/v1/auth/register
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, token, refreshToken } = await AuthService.register(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      user_id: user._id,
      user_name: user.first_name,
      user_type: user.user_type,
      token,
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

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    token,
    user_id: user._id,
    user_name: user.first_name,
    user_type: user.user_type,
  });
});

// @route PUT /api/v1/auth/refresh-token
export const refreshToken = asyncHandler(async (req: any, res: any) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const accessToken = AuthService.refreshAccessToken(token);
    res.status(200).json({ accessToken });
  } catch {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});
