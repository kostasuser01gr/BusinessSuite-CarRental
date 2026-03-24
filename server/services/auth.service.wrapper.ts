import { AuthService as DbAuthService } from './auth.service.js';
import { AuthService as MemoryAuthService } from './auth.service.memory.js';

const useDatabase = !!process.env.DATABASE_URL;

export const AuthService = useDatabase ? DbAuthService : MemoryAuthService;

if (!useDatabase) {
  console.warn('Using in-memory auth service - data will not persist');
}
