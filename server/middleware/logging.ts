import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import morgan from 'morgan';

declare module 'express-serve-static-core' {
  interface Request {
    correlationId?: string;
    startTime?: number;
  }
}

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  res.setHeader('X-Correlation-ID', req.correlationId);
  req.startTime = Date.now();
  next();
};

export const requestLogger = morgan(
  (tokens, req, res) => {
    const correlationId = (req as Request).correlationId;
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      correlationId,
      responseTime: tokens['response-time'](req, res) + 'ms',
      contentLength: tokens.res(req, res, 'content-length'),
      userAgent: tokens['user-agent'](req, res),
      ip: tokens['remote-addr'](req, res),
    });
  },
  {
    stream: {
      write: (message: string) => {
        try {
          const log = JSON.parse(message);
          logger.info('HTTP Request', log);
        } catch {
          logger.info(message.trim());
        }
      },
    },
  }
);

export const auditLogger = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send.bind(res);

    res.send = ((data: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logger.info('Audit Log', {
          correlationId: req.correlationId,
          action,
          userId: (req.session as any)?.userId,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          method: req.method,
          path: req.path,
        });
      }

      return originalSend(data);
    }) as typeof res.send;

    next();
  };
};
