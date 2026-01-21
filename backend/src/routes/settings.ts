import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, requireRole } from '../middleware/auth';
import { configService } from '../services/configService';

const router = express.Router();

/**
 * GET /api/settings
 * List all configuration groups (Admin only)
 */
router.get('/', authenticate, requireRole('ADMIN', 'DIET_OFFICIAL', 'SCERT_OFFICIAL'), asyncHandler(async (req, res) => {
    const configs = await configService.getAll();
    res.json({
        success: true,
        data: configs,
    });
}));

/**
 * PUT /api/settings/:key
 * Update a specific configuration group (Admin only)
 */
router.put('/:key', authenticate, requireRole('ADMIN'), asyncHandler(async (req, res) => {
    const { key } = req.params;
    const value = req.body;

    if (!value) {
        return res.status(400).json({ success: false, error: 'Value is required' });
    }

    await configService.set(key, value);

    res.json({
        success: true,
        message: `Configuration ${key} updated successfully`,
        data: value,
    });
}));

export default router;
