/**
 * Feedback & Impact Tracking Routes
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /api/feedback
 * Submit feedback for a training module
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const {
    moduleId,
    rating,
    comment,
    completed,
  } = req.body;

  logger.info('Submitting feedback', { userId, moduleId });

  // Update user training record
  const userTraining = await prisma.userTraining.update({
    where: {
      userId_moduleId: {
        userId,
        moduleId,
      },
    },
    data: {
      rating: rating ? parseInt(rating) : null,
      feedback: comment || null,
      completedAt: completed ? new Date() : null,
      status: completed ? 'COMPLETED' : 'IN_PROGRESS',
    },
  });

  // Update module statistics
  if (completed && rating) {
    const module = await prisma.trainingModule.findUnique({
      where: { id: moduleId },
      select: {
        viewCount: true,
        completionRate: true,
        avgRating: true,
      },
    });

    if (module) {
      const totalRatings = await prisma.userTraining.count({
        where: {
          moduleId,
          rating: { not: null },
        },
      });

      const avgRating = await prisma.userTraining.aggregate({
        where: {
          moduleId,
          rating: { not: null },
        },
        _avg: {
          rating: true,
        },
      });

      const totalCompletions = await prisma.userTraining.count({
        where: {
          moduleId,
          status: 'COMPLETED',
        },
      });

      const totalAssignments = await prisma.userTraining.count({
        where: {
          moduleId,
        },
      });

      await prisma.trainingModule.update({
        where: { id: moduleId },
        data: {
          viewCount: (module.viewCount || 0) + 1,
          completionRate: totalAssignments > 0 ? totalCompletions / totalAssignments : 0,
          avgRating: avgRating._avg.rating || 0,
        },
      });
    }
  }

  res.json({
    success: true,
    data: userTraining,
  });
}));

/**
 * GET /api/analytics/module-performance
 * Get module performance analytics (Admin only)
 */
router.get('/module-performance', authenticate, asyncHandler(async (req, res) => {
  // Check admin role
  if (!['ADMIN', 'DIET_OFFICIAL', 'SCERT_OFFICIAL'].includes(req.user!.role)) {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }

  const { moduleId, startDate, endDate } = req.query;

  const where: any = {};
  if (moduleId) {
    where.moduleId = moduleId;
  }
  if (startDate || endDate) {
    where.completedAt = {};
    if (startDate) where.completedAt.gte = new Date(startDate as string);
    if (endDate) where.completedAt.lte = new Date(endDate as string);
  }

  const [totalAssignments, totalCompletions, avgRating, ratings] = await Promise.all([
    prisma.userTraining.count({ where }),
    prisma.userTraining.count({
      where: {
        ...where,
        status: 'COMPLETED',
      },
    }),
    prisma.userTraining.aggregate({
      where: {
        ...where,
        rating: { not: null },
      },
      _avg: {
        rating: true,
      },
    }),
    prisma.userTraining.findMany({
      where: {
        ...where,
        rating: { not: null },
      },
      select: {
        rating: true,
        feedback: true,
        completedAt: true,
      },
    }),
  ]);

  const completionRate = totalAssignments > 0 ? totalCompletions / totalAssignments : 0;

  // Rating distribution
  const ratingDistribution = {
    5: ratings.filter(r => r.rating === 5).length,
    4: ratings.filter(r => r.rating === 4).length,
    3: ratings.filter(r => r.rating === 3).length,
    2: ratings.filter(r => r.rating === 2).length,
    1: ratings.filter(r => r.rating === 1).length,
  };

  res.json({
    success: true,
    data: {
      totalAssignments,
      totalCompletions,
      completionRate,
      avgRating: avgRating._avg.rating || 0,
      ratingDistribution,
      feedback: ratings.filter(r => r.feedback).map(r => ({
        rating: r.rating,
        feedback: r.feedback,
        date: r.completedAt,
      })),
    },
  });
}));

export default router;
