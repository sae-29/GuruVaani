import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

class ConfigService {
    private cache: Map<string, any> = new Map();

    /**
     * Get a configuration value by key
     */
    async get<T>(key: string, defaultValue?: T): Promise<T> {
        // Check local cache first
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        try {
            const config = await prisma.systemConfig.findUnique({
                where: { key },
            });

            if (config) {
                const value = JSON.parse(config.value);
                this.cache.set(key, value);
                return value;
            }
        } catch (error) {
            logger.error(`Error fetching config key: ${key}`, error);
        }

        return defaultValue as T;
    }

    /**
     * Set a configuration value
     */
    async set(key: string, value: any): Promise<void> {
        const valueStr = JSON.stringify(value);

        try {
            await prisma.systemConfig.upsert({
                where: { key },
                update: { value: valueStr },
                create: { key, value: valueStr },
            });

            this.cache.set(key, value);
            logger.info(`System config updated: ${key}`);
        } catch (error) {
            logger.error(`Error setting config key: ${key}`, error);
            throw error;
        }
    }

    /**
     * Get all configurations
     */
    async getAll(): Promise<Record<string, any>> {
        try {
            const configs = await prisma.systemConfig.findMany();
            const result: Record<string, any> = {};

            configs.forEach(c => {
                result[c.key] = JSON.parse(c.value);
            });

            return result;
        } catch (error) {
            logger.error('Error fetching all configs', error);
            return {};
        }
    }

    /**
     * Initialize default configurations if not exists
     */
    async initializeDefaults(): Promise<void> {
        const defaults = [
            {
                key: 'ai_behavior',
                value: {
                    tone: 'supportive',
                    depth: 'comprehensive',
                    visibility: 'immediate',
                }
            },
            {
                key: 'platform_experience',
                value: {
                    reflectionFrequency: 'daily',
                    nudgeFrequency: 'weekly',
                    allowVoiceEntry: true,
                    enableAIInsights: true,
                }
            },
            {
                key: 'privacy',
                value: {
                    dataRetentionDays: 365,
                    anonymizeAdminViews: true,
                }
            }
        ];

        for (const d of defaults) {
            const existing = await prisma.systemConfig.findUnique({ where: { key: d.key } });
            if (!existing) {
                await this.set(d.key, d.value);
            }
        }
    }
}

export const configService = new ConfigService();
