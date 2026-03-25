import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema.js';
import { config } from '../config/index.js';

let pool: any = null;
let db: any = null;

if (config.hasDatabase && config.databaseUrl) {
  pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  db = drizzle(pool, { schema });
} else {
  console.warn('DATABASE_URL not set or invalid - database features unavailable');
}

export { db };

export async function testConnection() {
  if (!pool) {
    return false;
  }

  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

if (pool) {
  process.on('SIGTERM', async () => {
    await pool.end();
    console.log('Database pool closed');
  });

  process.on('SIGINT', async () => {
    await pool.end();
    console.log('Database pool closed');
    process.exit(0);
  });
}
