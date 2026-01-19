/**
 * Analytics Routes
 * Clustering, alerts, and impact metrics
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, requireRole } from '../middleware/auth';
import { clusteringService } from '../services/clusteringService';
import { logger } from '../utils/logger';

const router = express.Router();

// Public analytics endpoints (for backward compatibility)
/**
 * GET /api/analytics/dashboard - Get dashboard metrics
 */
router.get('/dashboard', asyncHandler(async (req, res) => {
  logger.info('Fetching dashboard analytics');
  
  // Mock dashboard metrics
  const metrics = {
    totalTeachers: 156,
    activeTeachers: 142,
    totalReflections: 1247,
    weeklyReflections: 89,
    avgSentiment: 0.15,
    urgentIssues: 3,
    completedTrainings: 234,
    engagementRate: 78.5,
  };
  
  const trends = [
    { date: '2024-01-08', reflections: 12, sentiment: 0.2, engagement: 75 },
    { date: '2024-01-09', reflections: 15, sentiment: 0.1, engagement: 78 },
    { date: '2024-01-10', reflections: 18, sentiment: 0.3, engagement: 82 },
    { date: '2024-01-11', reflections: 14, sentiment: -0.1, engagement: 76 },
    { date: '2024-01-12', reflections: 16, sentiment: 0.2, engagement: 80 },
    { date: '2024-01-13', reflections: 11, sentiment: 0.4, engagement: 85 },
    { date: '2024-01-14', reflections: 13, sentiment: 0.1, engagement: 79 },
  ];
  
  res.json({
    success: true,
    data: {
      metrics,
      trends,
      lastUpdated: new Date().toISOString(),
    },
  });
}));

/**
 * GET /api/analytics/sentiment - Get sentiment analysis
 */
router.get('/sentiment', asyncHandler(async (req, res) => {
  const { timeframe = 'weekly' } = req.query;
  
  logger.info('Fetching sentiment analytics', { timeframe });
  
  // Mock sentiment data
  const sentimentData = {
    overall: 0.15,
    bySubject: {
      Mathematics: -0.1,
      Science: 0.4,
      English: 0.2,
      Hindi: 0.1,
      'Social Studies': 0.0,
    },
    byGrade: {
      'Class 1': 0.3,
      'Class 2': 0.2,
      'Class 3': 0.1,
      'Class 4': -0.1,
      'Class 5': 0.0,
    },
    trends: [
      { date: '2024-01-08', sentiment: 0.2 },
      { date: '2024-01-09', sentiment: 0.1 },
      { date: '2024-01-10', sentiment: 0.3 },
      { date: '2024-01-11', sentiment: -0.1 },
      { date: '2024-01-12', sentiment: 0.2 },
      { date: '2024-01-13', sentiment: 0.4 },
      { date: '2024-01-14', sentiment: 0.1 },
    ],
  };
  
  res.json({
    success: true,
    data: sentimentData,
  });
}));

/**
 * GET /api/analytics/clusters
 * Get clusters of similar diary entries (Admin only)
 */
router.get(
  '/clusters',
  authenticate,
  requireRole('ADMIN', 'DIET_OFFICIAL', 'SCERT_OFFICIAL'),
  asyncHandler(async (req, res) => {
    const { region, startDate, endDate, minEntries } = req.query;

    logger.info('Generating clusters', { region, startDate, endDate });

    const clusters = await clusteringService.generateClusters({
      region: region as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      minEntries: minEntries ? parseInt(minEntries as string) : undefined,
    });

    res.json({
      success: true,
      data: clusters,
    });
  })
);

/**
 * GET /api/analytics/alerts
 * Get priority alerts (Admin only)
 */
router.get(
  '/alerts',
  authenticate,
  requireRole('ADMIN', 'DIET_OFFICIAL', 'SCERT_OFFICIAL'),
  asyncHandler(async (req, res) => {
    const { region, startDate, endDate } = req.query;

    const alerts = await clusteringService.generateAlerts({
      region: region as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.json({
      success: true,
      data: alerts,
    });
  })
);

/**
 * GET /api/analytics/impact
 * Get impact metrics (Admin only)
 */
router.get(
  '/impact',
  authenticate,
  requireRole('ADMIN', 'DIET_OFFICIAL', 'SCERT_OFFICIAL'),
  asyncHandler(async (req, res) => {
    const { region, startDate, endDate } = req.query;

    const impact = await clusteringService.calculateImpact({
      region: region as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.json({
      success: true,
      data: impact,
    });
  })
);

export default router;
