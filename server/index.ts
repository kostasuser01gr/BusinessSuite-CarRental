import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pkg from 'pg';
const { Pool } = pkg;
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { testConnection } from './db/index.js';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import gdprRoutes from './routes/gdpr.js';
import {
  securityHeaders,
  generalLimiter,
  requestSizeLimit,
  validateContentType,
} from './middleware/security.js';
import {
  correlationIdMiddleware,
  requestLogger,
} from './middleware/logging.js';
import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler.js';

const isTest = config.nodeEnv === 'test';
const PgSession = connectPgSimple(session);

const pool = !isTest && process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: config.isProd ? { rejectUnauthorized: false } : false,
    })
  : null;

const sessionStore = !isTest && pool
  ? new PgSession({
      pool,
      tableName: 'sessions',
      createTableIfMissing: false,
    })
  : new session.MemoryStore();

export const app = express();

app.use(correlationIdMiddleware);

app.use(securityHeaders);

const allowedOrigins = [
  config.clientUrl,
  ...config.corsAllowedOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (/^https:\/\/adaptive-ai-business-suite.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(requestSizeLimit);

app.use(requestLogger);

app.use(session({
  store: sessionStore,
  name: 'adaptive_sid',
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

app.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'adaptiveai-business-suite-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/health/db', async (_req, res) => {
  const isConnected = await testConnection();
  res.status(isConnected ? 200 : 503).json({
    ok: isConnected,
    database: isConnected ? 'connected' : 'disconnected',
  });
});

app.get('/health/ready', async (_req, res) => {
  const dbConnected = await testConnection();
  const ready = dbConnected;

  res.status(ready ? 200 : 503).json({
    ready,
    checks: {
      database: dbConnected,
    },
  });
});

app.use(generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/gdpr', gdprRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection', { reason: reason?.message, stack: reason?.stack });
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

if (config.nodeEnv !== 'test') {
  testConnection().then((connected) => {
    if (connected) {
      logger.info('Database connection established');
    } else {
      logger.warn('Database connection failed - using fallback in-memory storage for development');
    }

    app.listen(config.port, () => {
      logger.info(`API listening on http://localhost:${config.port}`);
    });
  });
}
