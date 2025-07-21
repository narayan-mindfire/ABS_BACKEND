import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/User";
import { Response, NextFunction, Request } from "express";

interface JwtPayload {
  id: string;
  email: string;
  user_type: string;
}

/**
 * Middleware to protect routes using JWT from cookies.
 *
 * This reads the access token from `req.cookies.accessToken`,
 * verifies it, and attaches the user to `req.user`.
 */
export const protect = asyncHandler(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token found");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const user = await UserModel.findById(decoded.id).select("-password");

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
);
