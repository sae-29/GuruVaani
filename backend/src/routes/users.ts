/**
 * Users Routes
 * User profile and stats endpoints
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, requireRole } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/users/me
 * Get current user profile and stats
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
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

    if (!user) {
        res.status(404).json({
            success: false,
            error: 'User not found',
        });
        return;
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
 * PUT /api/users/me
 * Update current user profile
 */
router.put('/me', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const { firstName, lastName, subjects, grades } = req.body;

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(subjects && { subjects: subjects.join(',') }),
            ...(grades && { grades: grades.join(',') }),
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            subjects: true,
            grades: true,
        },
    });

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
 * GET /api/users
 * List all users with filtering (Admin only)
 */
router.get('/', authenticate, requireRole('ADMIN', 'DIET_OFFICIAL', 'SCERT_OFFICIAL'), asyncHandler(async (req, res) => {
    const { role, district, block, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (role) where.role = role;
    if (district) where.school = { district };
    if (block) where.school = { ...where.school, block };
    if (search) {
        where.OR = [
            { firstName: { contains: search as string } },
            { lastName: { contains: search as string } },
            { email: { contains: search as string } },
        ];
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                status: true,
                createdAt: true,
                school: {
                    select: { name: true, district: true, block: true }
                },
                totalReflections: true,
                streakDays: true,
                lastActiveAt: true,
            },
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
    ]);

    res.json({
        success: true,
        data: {
            users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            }
        },
    });
}));

/**
 * GET /api/users/:id
 * Get detailed user profile (Admin only)
 */
router.get('/:id', authenticate, requireRole('ADMIN', 'DIET_OFFICIAL', 'SCERT_OFFICIAL'), asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: {
            school: {
                select: {
                    name: true,
                    district: true,
                    block: true,
                }
            },
            reflections: {
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                    sentiment: true,
                }
            },
        },
    });

    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
        success: true,
        data: user,
    });
}));

/**
 * PUT /api/users/:id/status
 * Update user status (Admin only)
 */
router.put('/:id/status', authenticate, requireRole('ADMIN'), asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { status },
    });

    res.json({
        success: true,
        data: { id: user.id, status: user.status },
    });
}));

export default router;
