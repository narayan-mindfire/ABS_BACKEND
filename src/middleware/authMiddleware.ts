import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import UserModel from '../models/User';
import { Response, NextFunction } from 'express';

interface JwtPayload {
  id: string;
  email: string;
  user_type: string;
}

/**
 * Middleware to protect routes by verifying JWT tokens.
 *
 * This middleware checks for a Bearer token in the `Authorization` header,
 * verifies the token using the JWT secret, and attaches the corresponding user
 * (excluding the password) to the `req.user` property. If the token is missing,
 * invalid, or the user does not exist, it responds with a 401 Unauthorized error.
 *
 * @param req - Express request object, extended to include `user` property.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 *
 * @throws {Error} If no token is provided, the token is invalid, or the user is not found.
 */
export const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log("got token: ", token)
    try {
      const decoded_token = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = await UserModel.findById(decoded_token.id).select('-password');

      if (!req.user) {
        res.status(404);
        throw new Error('User not found');
      }
      next();
    } catch (error) {
      console.log("not authrorized aur invalida token")
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
  } else {
    console.log("no token found")
    res.status(401);
    throw new Error('Not authorized, missing token');
  }
});
