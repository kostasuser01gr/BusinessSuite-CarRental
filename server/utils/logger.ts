import winston from 'winston';
import { config } from '../config/index.js';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, correlationId, ...meta }) => {
    const correlation = correlationId ? `[${correlationId}] ` : '';
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} ${level}: ${correlation}${message} ${metaStr}`;
  })
);

export const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'adaptiveai-api' },
  transports: [
    new winston.transports.Console({
      format: config.nodeEnv === 'production' ? logFormat : devFormat,
    }),
  ],
});

if (config.nodeEnv === 'production') {
  logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
  logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
}

export function logWithCorrelation(correlationId: string, level: string, message: string, meta?: any) {
  logger.log(level, message, { correlationId, ...meta });
}
