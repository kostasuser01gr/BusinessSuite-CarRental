import bcrypt from 'bcryptjs';
import { SignupInput, LoginInput } from '../../shared/schemas.js';
import { createUser, findUserByEmail, findUserById } from '../store/index.js';

export class AuthService {
  static async signup(input: SignupInput) {
    const existing = findUserByEmail(input.email);
    if (existing) {
      throw { status: 400, message: 'User already exists with this email' };
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const newUser = {
      id: Math.random().toString(36).substring(7),
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'viewer' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createUser(newUser);
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async login(input: LoginInput) {
    const user = findUserByEmail(input.email);
    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getMe(userId: string) {
    const user = findUserById(userId);
    if (!user) {
      throw { status: 401, message: 'User not found' };
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updatePassword(userId: string, newPassword: string) {
    const user = findUserById(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordHash = passwordHash;
  }

  static async softDeleteUser(userId: string) {
    const user = findUserById(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
  }

  static async exportUserData(userId: string) {
    const user = findUserById(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const { passwordHash: _, ...userData } = user;
    return {
      ...userData,
      tasks: [],
      notes: [],
      exportedAt: new Date().toISOString(),
    };
  }
}
