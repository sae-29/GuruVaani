import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = 500, message } = err;

  logger.error('Error occurred:', {
    error: message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  next(error);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);