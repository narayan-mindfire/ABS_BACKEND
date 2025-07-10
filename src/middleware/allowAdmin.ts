import asyncHandler from 'express-async-handler';
import { Response, NextFunction } from 'express';
import {UserType} from "../types/models"

/**
 * This middleware checks if current user is of type admin or no
 * 
 * @param req - Express request object, extended to include `user` property.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 *
 * @throws {Error} If no token is provided, the token is invalid, or the user is not found.
 */
export const adminOnly = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  if(!req.user || req.user.user_type !== UserType.Admin){
    res.status(403);
    throw new Error('Access Denied: Admin only route')
  }
  next();
});
