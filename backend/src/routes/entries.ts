/**
 * Diary Entry Routes
 * Handles offline-first entry submission and retrieval
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { offlineSyncService } from '../services/offlineSyncService';
import { grokService } from '../services/grokService';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /api/entries/analyze
 * Real-time analysis for live suggestions (not persisted)
 */
router.post('/analyze', authenticate, asyncHandler(async (req, res) => {
  const { content, subject, grade } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, error: 'Content required' });
  }

  const aiResponse = await grokService.generateTeacherResponse({
    diaryText: content,
    subject,
    grade
  });
  const suggestions = aiResponse.tips;

  res.json({
    success: true,
    data: { suggestions }
  });
}));

/**
 * POST /api/entries/sync
 * Batch sync entries from offline client
 */
router.post('/sync', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { entries, deviceId, lastSyncTimestamp } = req.body;

  logger.info('Processing batch sync', { userId, entryCount: entries?.length || 0 });

  if (!entries || !Array.isArray(entries)) {
    return res.status(400).json({
      success: false,
      error: 'Entries array is required',
    });
  }

  const result = await offlineSyncService.processBatchSync(userId, {
    entries,
    deviceId: deviceId || 'unknown',
    lastSyncTimestamp,
  });

  res.json({
    success: true,
    data: result,
  });
}));

/**
 * POST /api/entries
 * Create a single entry (online mode)
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const {
    textContent,
    content: rawContent,
    audioUrl,
    transcript,
    title,
    grade,
    subject,
    topic,
    mood,
    topicTags,
    tags: rawTags,
    language,
  } = req.body;

  logger.info('Creating entry', { userId, title });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { schoolId: true },
  });

  const content = transcript || textContent || rawContent || '';
  if (!content) {
    res.status(400).json({
      success: false,
      error: 'Content is required',
    });
    return;
  }

  // Handle tags - convert array to comma-separated string
  const tagsArray = topicTags || rawTags || [];
  const tagsString = Array.isArray(tagsArray) ? tagsArray.join(',') : tagsArray;

  // Generate title if not provided
  const entryTitle = title || content.split(/\s+/).slice(0, 8).join(' ') + '...';

  const entry = await prisma.reflection.create({
    data: {
      title: entryTitle,
      content: content,
      entryMode: audioUrl ? 'VOICE' : 'TEXT',
      audioUrl: audioUrl || null,
      transcript: transcript || textContent || null,
      grade: grade || null,
      subject: subject || null,
      topic: topic || (tagsArray[0] || null),
      tags: tagsString || null,
      status: 'SUBMITTED',
      authorId: userId,
      schoolId: user?.schoolId || null,
      submittedAt: new Date(),
    },
  });

  // Update user's reflection count
  await prisma.user.update({
    where: { id: userId },
    data: { totalReflections: { increment: 1 } },
  });

  logger.info('Entry created successfully', { entryId: entry.id, userId });

  res.status(201).json({
    success: true,
    data: {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      subject: entry.subject,
      grade: entry.grade,
      tags: entry.tags?.split(',').filter(Boolean) || [],
      status: entry.status,
      createdAt: entry.createdAt,
    },
    message: 'Your reflection has been saved successfully!',
  });
}));

/**
 * GET /api/entries/my
 * Get current user's entries
 */
router.get('/my', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { page = 1, limit = 25, status } = req.query;

  const entries = await prisma.reflection.findMany({
    where: {
      authorId: userId,
      ...(status && { status: status as any }),
    },
    orderBy: { createdAt: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    include: {
      analytics: true,
    },
  });

  const total = await prisma.reflection.count({
    where: {
      authorId: userId,
      ...(status && { status: status as any }),
    },
  });

  res.json({
    success: true,
    data: {
      entries,
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
 * GET /api/entries/:id
 * Get single entry by ID
 */
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const entry = await prisma.reflection.findFirst({
    where: {
      id,
      authorId: userId, // Users can only see their own entries
    },
    include: {
      analytics: true,
      comments: {
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!entry) {
    return res.status(404).json({
      success: false,
      error: 'Entry not found',
    });
  }

  // Get AI suggestions if available
  let aiResponse: any = null;
  try {
    aiResponse = await grokService.generateTeacherResponse({
      diaryText: entry.transcript || entry.content,
      grade: entry.grade || undefined,
      subject: entry.subject || undefined,
    });
  } catch (error) {
    logger.warn('Failed to get AI response', error);
  }

  res.json({
    success: true,
    data: {
      ...entry,
      aiResponse,
    },
  });
}));

/**
 * GET /api/entries/admin
 * Get entries for admin (anonymized)
 */
router.get('/admin/list', authenticate, asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIET_OFFICIAL' && req.user!.role !== 'SCERT_OFFICIAL') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }

  const { page = 1, limit = 25, region, grade, subject, startDate, endDate } = req.query;

  const entries = await prisma.reflection.findMany({
    where: {
      status: { in: ['SUBMITTED', 'AI_ANALYZED', 'CLUSTERED'] },
      ...(grade && { grade }),
      ...(subject && { subject }),
      ...(startDate && { createdAt: { gte: new Date(startDate as string) } }),
      ...(endDate && { createdAt: { lte: new Date(endDate as string) } }),
      ...(region && {
        author: {
          school: {
            district: region as string,
          },
        },
      }),
    },
    orderBy: { createdAt: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    select: {
      id: true,
      content: true,
      transcript: true,
      grade: true,
      subject: true,
      topic: true,
      tags: true,
      sentiment: true,
      keywords: true,
      status: true,
      createdAt: true,
      // Anonymized author info
      author: {
        select: {
          id: true,
          role: true,
          // No name or personal info
        },
      },
      school: {
        select: {
          district: true,
          block: true,
          // No school name
        },
      },
    },
  });

  const total = await prisma.reflection.count({
    where: {
      status: { in: ['SUBMITTED', 'AI_ANALYZED', 'CLUSTERED'] },
      ...(grade && { grade }),
      ...(subject && { subject }),
      ...(startDate && { createdAt: { gte: new Date(startDate as string) } }),
      ...(endDate && { createdAt: { lte: new Date(endDate as string) } }),
    },
  });

  res.json({
    success: true,
    data: {
      entries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
}));

export default router;
