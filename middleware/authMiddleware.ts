import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import UserModel from '../models/User';
import { Response, NextFunction } from 'express';

interface JwtPayload {
  id: string;
  email: string;
  user_type: string;
}

export const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded_token = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = await UserModel.findById(decoded_token.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
