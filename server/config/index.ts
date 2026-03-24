import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long").optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_CLIENT_URL: z.string().url().default('http://localhost:3100'),
  CORS_ALLOWED_ORIGINS: z.string().optional(),
  DATABASE_URL: z.string().optional(), // Make required when DB is ready
});

const env = configSchema.safeParse(process.env);
const requestedNodeEnv = process.env.NODE_ENV === 'production'
  ? 'production'
  : process.env.NODE_ENV === 'test'
    ? 'test'
    : 'development';

if (!env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(env.error.format(), null, 2));
  if (requestedNodeEnv === 'production') {
    process.exit(1);
  }
}

const validatedEnv = env.success ? env.data : {
  PORT: 5000,
  SESSION_SECRET: undefined,
  NODE_ENV: requestedNodeEnv,
  VITE_CLIENT_URL: 'http://localhost:3100',
  CORS_ALLOWED_ORIGINS: undefined,
  DATABASE_URL: undefined,
};

if (validatedEnv.NODE_ENV === 'production' && !validatedEnv.SESSION_SECRET) {
  console.error('❌ Invalid environment variables:', JSON.stringify({
    _errors: [],
    SESSION_SECRET: { _errors: ['Required in production'] },
  }, null, 2));
  process.exit(1);
}

export const config = {
  port: validatedEnv.PORT,
  sessionSecret: validatedEnv.SESSION_SECRET ?? 'dev-fallback-secret-extremely-long-and-secure',
  nodeEnv: validatedEnv.NODE_ENV,
  clientUrl: validatedEnv.VITE_CLIENT_URL,
  corsAllowedOrigins: validatedEnv.CORS_ALLOWED_ORIGINS ?? '',
  databaseUrl: validatedEnv.DATABASE_URL,
  isProd: validatedEnv.NODE_ENV === 'production',
};
