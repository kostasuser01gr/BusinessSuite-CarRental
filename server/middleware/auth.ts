import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../store/index.js';
import { User } from '../../shared/types.js';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

// Safer way to extend Express Request without namespace if preferred by lint
declare module 'express-serve-static-core' {
  interface Request {
    user?: User | null;
  }
}

/**
 * requireAuth: Blocks access if user is not logged in.
 * Sets req.user if session is valid.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authentication required to access this resource' 
    });
  }

  const user = findUserById(req.session.userId);
  if (!user) {
    // Session exists but user not found (deleted?)
    req.session.destroy(() => {});
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'User session invalid' 
    });
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  req.user = userWithoutPassword;
  next();
};

/**
 * optionalAuth: Populates req.user if session exists, but does not block.
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    const user = findUserById(req.session.userId);
    if (user) {
      const { passwordHash: _, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }
  }
  next();
};
