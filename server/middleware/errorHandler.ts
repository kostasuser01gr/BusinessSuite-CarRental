import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => unknown | Promise<unknown>;

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  let code =
    err.code ||
    (statusCode >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');

  logger.error('Error occurred', {
    correlationId: req.correlationId,
    error: {
      message: err.message,
      stack: err.stack,
      statusCode,
      code,
    },
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: (req.session as any)?.userId,
    },
  });

  if (err.name === 'ZodError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    const zodError = err as any;
    const details = zodError.issues?.map((issue: any) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(statusCode).json({
      error: {
        message,
        code,
        correlationId: req.correlationId,
        details,
      },
    });
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    code = 'UNAUTHORIZED';
    message = 'Invalid or expired token';
  }

  if (err.code === '23505') {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    message = 'Resource already exists';
  }

  if (err.code === '23503') {
    statusCode = 400;
    code = 'FOREIGN_KEY_VIOLATION';
    message = 'Referenced resource does not exist';
  }

  if (req.app.get('env') === 'production' && statusCode >= 500) {
    message = 'Something went wrong';
    code = 'INTERNAL_ERROR';
  }

  res.status(statusCode).json({
    error: {
      message,
      code,
      correlationId: req.correlationId,
      ...(req.app.get('env') !== 'production' && { stack: err.stack }),
    },
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      code: 'NOT_FOUND',
      correlationId: req.correlationId,
      path: req.path,
    },
  });
};

export const asyncHandler = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
