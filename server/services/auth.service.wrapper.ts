import { config } from '../config/index.js';
import { AuthService as DatabaseAuthService } from './auth.service.js';
import { AuthService as MemoryAuthService } from './auth.service.memory.js';

const isTest = config.nodeEnv === 'test';
const useDatabase = !isTest && config.hasDatabase;

if (!useDatabase) {
  console.warn(
    isTest
      ? 'Using in-memory auth service for tests'
      : 'Using in-memory auth service - data will not persist'
  );
}

export const AuthService = useDatabase ? DatabaseAuthService : MemoryAuthService;
