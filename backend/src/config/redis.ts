/**
 * Redis Configuration
 * Handles Redis connection for caching and session storage
 */

import { createClient } from 'redis';
import { logger } from '../utils/logger';

let redisClient: ReturnType<typeof createClient> | null = null;

export const initializeRedis = async () => {
  try {
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis reconnection failed after 10 retries');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    client.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    client.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    logger.error('Failed to initialize Redis', error);
    // Return a mock client that does nothing
    return createMockRedisClient();
  }
};

const createMockRedisClient = () => {
  return {
    get: async () => null,
    setEx: async () => 'OK',
    del: async () => 0,
    exists: async () => 0,
    expire: async () => 0,
    disconnect: async () => {},
  } as any;
};

export { redisClient };
