/**
 * Training Module Routes
 * Handles module creation, retrieval, and dispatch
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, requireRole } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import multer from 'multer';
import { notificationService } from '../services/notificationService';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

/**
 * POST /api/modules
 * Create a new training module (Admin only)
 */
router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'DIET_OFFICIAL', 'SCERT_OFFICIAL'),
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      content,
      format,
      duration,
      subjects,
      grades,
      topics,
      difficulty,
      language,
      nepCompetencies,
    } = req.body;

    logger.info('Creating training module', { title });

    // TODO: Upload files to S3-compatible storage
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const videoUrl = files?.video?.[0] ? 's3://bucket/video.mp4' : null;
    const audioUrl = files?.audio?.[0] ? 's3://bucket/audio.mp3' : null;
    const thumbnailUrl = files?.thumbnail?.[0] ? 's3://bucket/thumbnail.jpg' : null;

    const module = await prisma.trainingModule.create({
      data: {
        title,
        description,
        content: content || null,
        format: format || 'TEXT',
        duration: duration ? parseInt(duration) : 0,
        videoUrl,
        audioUrl,
        thumbnailUrl,
        subjects: Array.isArray(subjects) ? subjects : subjects ? [subjects] : [],
        grades: Array.isArray(grades) ? grades : grades ? [grades] : [],
        topics: Array.isArray(topics) ? topics : topics ? [topics] : [],
        difficulty: difficulty || 'beginner',
        language: language || 'en',
        nepCompetencies: Array.isArray(nepCompetencies) ? nepCompetencies : [],
        isActive: true,
        publishedAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: module,
    });
  })
);

/**
 * GET /api/modules
 * Get all training modules
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 25,
    subject,
    grade,
    difficulty,
    language,
  } = req.query;

  const where: any = {
    isActive: true,
    ...(subject && { subjects: { has: subject as string } }),
    ...(grade && { grades: { has: grade as string } }),
    ...(difficulty && { difficulty }),
    ...(language && { language }),
  };

  const modules = await prisma.trainingModule.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  const total = await prisma.trainingModule.count({ where });

  res.json({
    success: true,
    data: {
      modules,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
}));

/**
 * GET /api/modules/:id
 * Get single module
 */
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const module = await prisma.trainingModule.findUnique({
    where: { id },
    include: {
      userTrainings: {
        where: {
          userId: req.user!.id,
        },
        take: 1,
      },
    },
  });

  if (!module) {
    return res.status(404).json({
      success: false,
      error: 'Module not found',
    });
  }

  res.json({
    success: true,
    data: module,
  });
}));

/**
 * POST /api/modules/dispatch
 * Dispatch modules to teachers/clusters (Admin only)
 */
router.post(
  '/dispatch',
  authenticate,
  requireRole('ADMIN', 'DIET_OFFICIAL', 'SCERT_OFFICIAL'),
  asyncHandler(async (req, res) => {
    const {
      moduleIds,
      teacherIds,
      clusterIds,
      sendNotification,
    } = req.body;

    logger.info('Dispatching modules', { moduleIds, teacherIds, clusterIds });

    // Get teachers from clusters if specified
    let targetTeacherIds = teacherIds || [];

    if (clusterIds && clusterIds.length > 0) {
      const clusterReflections = await prisma.clusterReflection.findMany({
        where: {
          clusterId: { in: clusterIds },
        },
        select: {
          reflection: {
            select: {
              authorId: true,
            },
          },
        },
      });

      const clusterTeacherIds = [
        ...new Set(clusterReflections.map(cr => cr.reflection.authorId)),
      ];
      targetTeacherIds = [...new Set([...targetTeacherIds, ...clusterTeacherIds])];
    }

    // Create user training records
    const userTrainings = [];
    for (const moduleId of moduleIds) {
      for (const teacherId of targetTeacherIds) {
        const userTraining = await prisma.userTraining.upsert({
          where: {
            userId_moduleId: {
              userId: teacherId,
              moduleId: moduleId,
            },
          },
          update: {},
          create: {
            userId: teacherId,
            moduleId: moduleId,
            status: 'ASSIGNED',
            assignedAt: new Date(),
          },
        });
        userTrainings.push(userTraining);
      }
    }

    // Send notifications if requested
    if (sendNotification) {
      for (const teacherId of targetTeacherIds) {
        await notificationService.sendNotification({
          userId: teacherId,
          type: 'TRAINING_ASSIGNED',
          title: 'New Training Module Assigned',
          message: `You have ${moduleIds.length} new training module(s) to complete`,
          data: {
            moduleIds,
          },
        });
      }
    }

    res.json({
      success: true,
      data: {
        dispatched: userTrainings.length,
        teachers: targetTeacherIds.length,
        modules: moduleIds.length,
      },
    });
  })
);

export default router;
