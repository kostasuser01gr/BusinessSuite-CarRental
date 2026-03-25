import bcrypt from 'bcryptjs';
import { SignupInput, LoginInput } from '../../shared/schemas.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq, and, isNull } from 'drizzle-orm';

export class AuthService {
  static ensureDatabase() {
    if (!db) {
      throw { status: 503, message: 'Database auth is unavailable' };
    }
  }

  static async signup(input: SignupInput) {
    AuthService.ensureDatabase();

    const existing = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (existing) {
      throw { status: 400, message: 'User already exists with this email' };
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const [newUser] = await db.insert(users).values({
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'viewer',
    }).returning();

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async login(input: LoginInput) {
    AuthService.ensureDatabase();

    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw {
        status: 423,
        message: `Account locked due to too many failed login attempts. Try again in ${minutesRemaining} minutes.`
      };
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isValid) {
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      const shouldLock = failedAttempts >= 5;

      await db.update(users)
        .set({
          failedLoginAttempts: failedAttempts,
          lockedUntil: shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      throw { status: 401, message: 'Invalid credentials' };
    }

    await db.update(users)
      .set({
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getMe(userId: string) {
    AuthService.ensureDatabase();

    const user = await db.query.users.findFirst({
      where: and(
        eq(users.id, userId),
        isNull(users.deletedAt)
      ),
    });

    if (!user) {
      throw { status: 401, message: 'User not found' };
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updatePassword(userId: string, newPassword: string) {
    AuthService.ensureDatabase();

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  static async softDeleteUser(userId: string) {
    AuthService.ensureDatabase();

    await db.update(users)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  static async exportUserData(userId: string) {
    AuthService.ensureDatabase();

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        tasks: true,
        notes: true,
      },
    });

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const { passwordHash: _, mfaSecret: __, ...userData } = user;
    return userData;
  }
}
