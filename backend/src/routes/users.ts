import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get('/', asyncHandler(async (req, res) => {
  logger.info('Fetching users list');
  
  // Mock users data
  const users = [
    {
      id: '1',
      name: 'Radha Sharma',
      email: 'radha.sharma@school.edu.in',
      school: 'Government Primary School, Sector 15',
      subjects: ['Mathematics', 'Science'],
      grades: ['Class 3', 'Class 4'],
      isActive: true,
      lastActive: new Date().toISOString(),
      totalReflections: 47,
      avgSentiment: 0.2,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Amit Kumar',
      email: 'amit.kumar@school.edu.in',
      school: 'Delhi Public School',
      subjects: ['Science', 'English'],
      grades: ['Class 4', 'Class 5'],
      isActive: true,
      lastActive: new Date().toISOString(),
      totalReflections: 32,
      avgSentiment: 0.5,
      createdAt: '2024-01-02T00:00:00Z',
    },
  ];
  
  res.json({
    success: true,
    data: {
      users,
      total: users.length,
    },
  });
}));

// GET /api/users/:id - Get user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  logger.info('Fetching user', { userId: id });
  
  // Mock user data
  const user = {
    id,
    name: 'Radha Sharma',
    email: 'radha.sharma@school.edu.in',
    phone: '+91 98765 43210',
    school: 'Government Primary School, Sector 15',
    subjects: ['Mathematics', 'Science'],
    grades: ['Class 3', 'Class 4'],
    experience: 8,
    qualification: 'B.Ed, M.A. Mathematics',
    isActive: true,
    lastActive: new Date().toISOString(),
    totalReflections: 47,
    weeklyReflections: 3,
    avgSentiment: 0.2,
    completedTrainings: 12,
    engagementScore: 85,
    createdAt: '2024-01-01T00:00:00Z',
  };
  
  res.json({
    success: true,
    data: user,
  });
}));

// PUT /api/users/:id - Update user
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  logger.info('Updating user', { userId: id, updateData });
  
  // Mock update - replace with real logic
  const updatedUser = {
    id,
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  
  res.json({
    success: true,
    data: updatedUser,
    message: 'User updated successfully',
  });
}));

// DELETE /api/users/:id - Delete user
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  logger.info('Deleting user', { userId: id });
  
  // Mock deletion - replace with real logic
  res.json({
    success: true,
    message: 'User deleted successfully',
  });
}));

// GET /api/users/:id/stats - Get user statistics
router.get('/:id/stats', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  logger.info('Fetching user stats', { userId: id });
  
  // Mock stats
  const stats = {
    totalReflections: 47,
    weeklyReflections: 3,
    monthlyReflections: 12,
    avgSentiment: 0.2,
    completedTrainings: 12,
    streakDays: 15,
    nepHours: 24.5,
    engagementScore: 85,
    lastReflection: new Date().toISOString(),
  };
  
  res.json({
    success: true,
    data: stats,
  });
}));

export default router;