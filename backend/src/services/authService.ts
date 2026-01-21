/**
 * Authentication Service
 * Handles JWT token generation/verification and password hashing
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'guru-vaani-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

interface AuthResult {
    success: boolean;
    user?: any;
    token?: string;
    error?: string;
}

class AuthService {
    /**
     * Hash a password
     */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    /**
     * Compare password with hash
     */
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Generate JWT token
     */
    generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    }

    /**
     * Verify JWT token
     */
    verifyToken(token: string): TokenPayload | null {
        try {
            return jwt.verify(token, JWT_SECRET) as TokenPayload;
        } catch (error) {
            logger.warn('Token verification failed', error);
            return null;
        }
    }

    /**
     * Register a new user
     */
    async register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: string;
        subjects?: string[];
        grades?: string[];
        schoolName?: string;
    }): Promise<AuthResult> {
        try {
            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existingUser) {
                return { success: false, error: 'Email already registered' };
            }

            // Hash password
            const hashedPassword = await this.hashPassword(data.password);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role || 'TEACHER',
                    subjects: data.subjects?.join(',') || '',
                    grades: data.grades?.join(',') || '',
                    isActive: true,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    subjects: true,
                    grades: true,
                    totalReflections: true,
                    completedTrainings: true,
                    streakDays: true,
                    nepHours: true,
                    createdAt: true,
                },
            });

            // Generate token
            const token = this.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            logger.info('User registered successfully', { userId: user.id });

            return {
                success: true,
                user: {
                    ...user,
                    subjects: user.subjects?.split(',').filter(Boolean) || [],
                    grades: user.grades?.split(',').filter(Boolean) || [],
                },
                token,
            };
        } catch (error) {
            logger.error('Registration failed', error);
            return { success: false, error: 'Registration failed. Please try again.' };
        }
    }

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<AuthResult> {
        try {
            // Find user
            const user = await prisma.user.findUnique({
                where: { email },
                include: {
                    school: {
                        select: { name: true, district: true },
                    },
                },
            });

            if (!user) {
                return { success: false, error: 'Invalid email or password' };
            }

            if (!user.isActive) {
                return { success: false, error: 'Account is disabled' };
            }

            // Verify password
            const isValid = await this.comparePassword(password, user.password);
            if (!isValid) {
                return { success: false, error: 'Invalid email or password' };
            }

            // Update last active
            await prisma.user.update({
                where: { id: user.id },
                data: { lastActiveAt: new Date() },
            });

            // Generate token
            const token = this.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            logger.info('User logged in', { userId: user.id });

            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    subjects: user.subjects?.split(',').filter(Boolean) || [],
                    grades: user.grades?.split(',').filter(Boolean) || [],
                    totalReflections: user.totalReflections,
                    completedTrainings: user.completedTrainings,
                    streakDays: user.streakDays,
                    nepHours: user.nepHours,
                    school: user.school,
                },
                token,
            };
        } catch (error) {
            logger.error('Login failed', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                subjects: true,
                grades: true,
                totalReflections: true,
                completedTrainings: true,
                streakDays: true,
                nepHours: true,
                school: {
                    select: { name: true, district: true },
                },
            },
        });
    }
}

export const authService = new AuthService();
