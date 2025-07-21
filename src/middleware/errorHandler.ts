import { NextFunction, Request, Response } from "express";

/**
 *
 * This function catches errors thrown in the application,
 * sets an appropriate HTTP status code, and responds with a JSON
 * object containing the error message and (optionally) the stack trace.
 *
 * @param {Error} err - The error object caught by Express.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 */
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
