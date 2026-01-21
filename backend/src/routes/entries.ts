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

  const suggestions = await grokService.analyzeRealtime(content, { subject, grade });

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
import { z } from 'zod';

const entrySchema = z.object({
  textContent: z.string().optional(),
  content: z.string().optional(),
  audioUrl: z.string().url().optional().nullable(),
  transcript: z.string().optional().nullable(),
  title: z.string().optional(),
  grade: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  topic: z.string().optional().nullable(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  topicTags: z.array(z.string()).optional(),
  sentiment: z.number().min(-1).max(1).optional(),
}).refine(data => data.content || data.textContent || data.transcript, {
  message: "Content is required (text, transcript, or raw content)",
  path: ["content"]
});

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  // Validate request body
  const validation = entrySchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.error.format()
    });
  }

  const data = validation.data;
  const rawContent = data.content || data.textContent || '';
  const finalContent = data.transcript || rawContent || '';

  logger.info('Creating entry', { userId, hasAudio: !!data.audioUrl });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { schoolId: true },
  });

  // Handle tags normalization
  let tagsString = '';
  if (Array.isArray(data.topicTags)) {
    tagsString = data.topicTags.join(',');
  } else if (Array.isArray(data.tags)) {
    tagsString = data.tags.join(',');
  } else if (typeof data.tags === 'string') {
    tagsString = data.tags;
  }

  // Generate title if missing
  const entryTitle = data.title || finalContent.split(/\s+/).slice(0, 8).join(' ') + '...';

  const entry = await prisma.reflection.create({
    data: {
      title: entryTitle,
      content: finalContent,
      entryMode: data.audioUrl ? 'VOICE' : 'TEXT',
      audioUrl: data.audioUrl,
      transcript: data.transcript,
      grade: data.grade,
      subject: data.subject,
      topic: data.topic,
      tags: tagsString,
      status: 'SUBMITTED',
      authorId: userId,
      schoolId: user?.schoolId,
      submittedAt: new Date(),
      sentiment: data.sentiment // Accept frontend sentiment if provided
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
  let aiResponse = null;
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
