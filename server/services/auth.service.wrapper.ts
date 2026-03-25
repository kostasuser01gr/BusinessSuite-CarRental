import { config } from '../config/index.js';
import { AuthService as DatabaseAuthService } from './auth.service.js';
import { AuthService as MemoryAuthService } from './auth.service.memory.js';

const isTest = config.nodeEnv === 'test';
const useDatabase = !isTest && config.hasDatabase;

export const AuthService = useDatabase ? DatabaseAuthService : MemoryAuthService;
