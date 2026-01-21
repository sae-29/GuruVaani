/**
 * Authentication Routes
 * Handles user registration, login, and session management
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user (Teacher by default)
 */
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, subjects, grades, schoolName } = req.body;

  // Validate required fields
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      error: 'Email, password, first name, and last name are required',
    });
  }

  // Password strength check
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters',
    });
  }

  const result = await authService.register({
    email,
    password,
    firstName,
    lastName,
    subjects,
    grades,
    schoolName,
  });

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error,
    });
  }

  logger.info('User registered', { email });

  res.status(201).json({
    success: true,
    data: {
      user: result.user,
      token: result.token,
    },
  });
}));

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required',
    });
  }

  const result = await authService.login(email, password);

  if (!result.success) {
    return res.status(401).json({
      success: false,
      error: result.error,
    });
  }

  logger.info('User logged in', { email });

  res.json({
    success: true,
    data: {
      user: result.user,
      token: result.token,
    },
  });
}));

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  const user = await authService.getUserById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.json({
    success: true,
    data: {
      ...user,
      subjects: user.subjects?.split(',').filter(Boolean) || [],
      grades: user.grades?.split(',').filter(Boolean) || [],
    },
  });
}));

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // This endpoint exists for API consistency
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}));

export default router;