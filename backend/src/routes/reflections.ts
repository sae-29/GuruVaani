/**
 * Reflections Routes
 * Teacher reflection entry management
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /api/reflections
 * Create a new reflection
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const { title, content, subject, grade, topic, tags, isPrivate } = req.body;

    const entry = await prisma.reflection.create({
        data: {
            title: title || null,
            content: content || '',
            authorId: userId,
            subject: subject || null,
            grade: grade || null,
            topic: topic || null,
            tags: Array.isArray(tags) ? tags.join(',') : tags || null,
            isPrivate: isPrivate || false,
            status: 'SUBMITTED',
        },
    });

    // Update user's reflection count
    await prisma.user.update({
        where: { id: userId },
        data: { totalReflections: { increment: 1 } },
    });

    res.status(201).json({
        success: true,
        data: {
            id: entry.id,
            title: entry.title,
            content: entry.content,
            subject: entry.subject,
            grade: entry.grade,
            topic: entry.topic,
            tags: entry.tags?.split(',').filter(Boolean) || [],
            status: entry.status,
            createdAt: entry.createdAt,
        },
    });
}));

/**
 * GET /api/reflections
 * Get user's reflections
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const reflections = await prisma.reflection.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    res.json({
        success: true,
        data: reflections.map(r => ({
            id: r.id,
            title: r.title,
            content: r.content,
            subject: r.subject,
            grade: r.grade,
            topic: r.topic,
            tags: r.tags?.split(',').filter(Boolean) || [],
            status: r.status,
            sentiment: r.sentiment,
            createdAt: r.createdAt,
        })),
    });
}));

/**
 * GET /api/reflections/:id
 * Get a specific reflection
 */
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const reflection = await prisma.reflection.findFirst({
        where: { id, authorId: userId },
    });

    if (!reflection) {
        res.status(404).json({
            success: false,
            error: 'Reflection not found',
        });
        return;
    }

    res.json({
        success: true,
        data: {
            id: reflection.id,
            title: reflection.title,
            content: reflection.content,
            subject: reflection.subject,
            grade: reflection.grade,
            topic: reflection.topic,
            tags: reflection.tags?.split(',').filter(Boolean) || [],
            status: reflection.status,
            sentiment: reflection.sentiment,
            keywords: reflection.keywords?.split(',').filter(Boolean) || [],
            createdAt: reflection.createdAt,
            analyzedAt: reflection.analyzedAt,
        },
    });
}));

export default router;
