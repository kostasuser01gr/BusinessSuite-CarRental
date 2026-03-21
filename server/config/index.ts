import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long"),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_CLIENT_URL: z.string().url().default('http://localhost:3100'),
  DATABASE_URL: z.string().optional(), // Make required when DB is ready
});

const env = configSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(env.error.format(), null, 2));
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

const validatedEnv = env.success ? env.data : {
  PORT: 5000,
  SESSION_SECRET: 'dev-fallback-secret-extremely-long-and-secure',
  NODE_ENV: 'development' as const,
  VITE_CLIENT_URL: 'http://localhost:3100',
  DATABASE_URL: undefined,
};

export const config = {
  port: validatedEnv.PORT,
  sessionSecret: validatedEnv.SESSION_SECRET,
  nodeEnv: validatedEnv.NODE_ENV,
  clientUrl: validatedEnv.VITE_CLIENT_URL,
  databaseUrl: validatedEnv.DATABASE_URL,
  isProd: validatedEnv.NODE_ENV === 'production',
};
