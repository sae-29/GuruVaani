/**
 * Settings Routes
 * Handles system-wide configuration for Admin Dashboard
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, requireRole } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// Default Settings
const DEFAULT_SETTINGS = {
    platform: {
        reflectionFrequency: 'weekly', // daily, weekly, monthly
        enablePrompts: true,
        enableFeedback: true,
        maintenanceMode: false,
    },
    ai: {
        summarizationDepth: 'detailed', // brief, detailed
        tone: 'supportive', // supportive, neutral, reflective
        visibility: 'admin_only', // admin_only, shared_with_teacher
        model: 'grok-beta',
    },
    privacy: {
        retentionDays: 365,
        analyticsConsent: true,
        dataSharingEvents: false,
    },
};

/**
 * GET /api/settings
 * Retrieve current system settings
 */
router.get('/', authenticate, requireRole(['ADMIN', 'SCERT_OFFICIAL']), asyncHandler(async (req, res) => {
    // Fetch specific config keys or return defaults if missing
    const configs = await prisma.systemConfig.findMany({
        where: {
            key: { in: ['platform_settings', 'ai_settings', 'privacy_settings'] }
        }
    });

    // Merge with defaults
    const response = {
        platform: { ...DEFAULT_SETTINGS.platform },
        ai: { ...DEFAULT_SETTINGS.ai },
        privacy: { ...DEFAULT_SETTINGS.privacy },
    };

    configs.forEach(config => {
        try {
            const data = JSON.parse(config.value);
            if (config.key === 'platform_settings') response.platform = { ...response.platform, ...data };
            if (config.key === 'ai_settings') response.ai = { ...response.ai, ...data };
            if (config.key === 'privacy_settings') response.privacy = { ...response.privacy, ...data };
        } catch (e) {
            logger.error(`Failed to parse config key: ${config.key}`, e);
        }
    });

    res.json({
        success: true,
        data: response
    });
}));

/**
 * PUT /api/settings
 * Update system settings
 */
router.put('/', authenticate, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
    const { platform, ai, privacy } = req.body;

    if (platform) {
        await prisma.systemConfig.upsert({
            where: { key: 'platform_settings' },
            update: { value: JSON.stringify(platform) },
            create: { key: 'platform_settings', value: JSON.stringify(platform) }
        });
    }

    if (ai) {
        await prisma.systemConfig.upsert({
            where: { key: 'ai_settings' },
            update: { value: JSON.stringify(ai) },
            create: { key: 'ai_settings', value: JSON.stringify(ai) }
        });
    }

    if (privacy) {
        await prisma.systemConfig.upsert({
            where: { key: 'privacy_settings' },
            update: { value: JSON.stringify(privacy) },
            create: { key: 'privacy_settings', value: JSON.stringify(privacy) }
        });
    }

    logger.info('System settings updated', { userId: req.user!.id });

    res.json({
        success: true,
        message: 'Settings updated successfully'
    });
}));

export default router;
