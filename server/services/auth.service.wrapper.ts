import { AuthService as DbAuthService } from './auth.service.js';
import { AuthService as MemoryAuthService } from './auth.service.memory.js';

const isTest = process.env.NODE_ENV === 'test';
const useDatabase = !isTest && !!process.env.DATABASE_URL;

export const AuthService = useDatabase ? DbAuthService : MemoryAuthService;

if (!useDatabase) {
  console.warn(
    isTest
      ? 'Using in-memory auth service for tests'
      : 'Using in-memory auth service - data will not persist'
  );
}
