/**
 * Clustering & Analytics Engine
 * Groups diary entries by semantic similarity and ranks by priority
 */

import { PrismaClient } from '@prisma/client';
import { grokService } from './grokService';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface ClusterResult {
  id: string;
  title: string;
  description: string;
  entryIds: string[];
  frequency: number;
  avgSentiment: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: Date;
  updatedAt: Date;
}

interface AlertResult {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  affectedEntryIds: string[];
  createdAt: Date;
}

class ClusteringService {
  /**
   * Generate clusters from diary entries
   */
  async generateClusters(filters?: {
    region?: string;
    startDate?: Date;
    endDate?: Date;
    minEntries?: number;
  }): Promise<ClusterResult[]> {
    try {
      // Fetch entries based on filters
      const entries = await prisma.reflection.findMany({
        where: {
          status: 'SUBMITTED',
          ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
          ...(filters?.endDate && { createdAt: { lte: filters.endDate } }),
          ...(filters?.region && {
            author: {
              school: {
                district: filters.region,
              },
            },
          }),
        },
        select: {
          id: true,
          content: true,
          transcript: true,
          grade: true,
          subject: true,
          sentiment: true,
          keywords: true,
        },
        take: filters?.minEntries ? Math.max(filters.minEntries, 50) : 100,
      });

      if (entries.length === 0) {
        return [];
      }

      // Prepare input for Grok AI
      const aiInput = {
        entries: entries.map(e => ({
          id: e.id,
          content: e.transcript || e.content,
          grade: e.grade || undefined,
          subject: e.subject || undefined,
          sentiment: e.sentiment || undefined,
        })),
        region: filters?.region,
        timeframe: filters?.startDate 
          ? `${filters.startDate.toISOString()} to ${filters.endDate?.toISOString() || 'now'}`
          : undefined,
      };

      // Get clusters from AI
      const aiResult = await grokService.generateAdminAnalytics(aiInput);

      // Convert to ClusterResult format
      const clusters: ClusterResult[] = aiResult.clusters.map((cluster, index) => ({
        id: cluster.id || `cluster-${Date.now()}-${index}`,
        title: cluster.title,
        description: cluster.description,
        entryIds: cluster.entryIds,
        frequency: cluster.frequency,
        avgSentiment: cluster.avgSentiment,
        priority: cluster.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Save clusters to database
      await this.saveClusters(clusters);

      return clusters;
    } catch (error) {
      logger.error('Error generating clusters', error);
      throw error;
    }
  }

  /**
   * Generate alerts from entries
   */
  async generateAlerts(filters?: {
    region?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AlertResult[]> {
    try {
      const entries = await prisma.reflection.findMany({
        where: {
          status: 'SUBMITTED',
          ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
          ...(filters?.endDate && { createdAt: { lte: filters.endDate } }),
          ...(filters?.region && {
            author: {
              school: {
                district: filters.region,
              },
            },
          }),
        },
        select: {
          id: true,
          content: true,
          transcript: true,
          sentiment: true,
          priority: true,
        },
        take: 100,
      });

      if (entries.length === 0) {
        return [];
      }

      const aiInput = {
        entries: entries.map(e => ({
          id: e.id,
          content: e.transcript || e.content,
          sentiment: e.sentiment || undefined,
        })),
        region: filters?.region,
      };

      const aiResult = await grokService.generateAdminAnalytics(aiInput);

      const alerts: AlertResult[] = aiResult.alerts.map((alert, index) => ({
        id: `alert-${Date.now()}-${index}`,
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        affectedEntryIds: alert.affectedEntries,
        createdAt: new Date(),
      }));

      return alerts;
    } catch (error) {
      logger.error('Error generating alerts', error);
      throw error;
    }
  }

  /**
   * Calculate impact metrics
   */
  async calculateImpact(filters?: {
    region?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    totalEntries: number;
    totalTeachers: number;
    avgSentiment: number;
    clustersGenerated: number;
    modulesDispatched: number;
    completionRate: number;
  }> {
    try {
      const [entries, teachers, clusters, modules] = await Promise.all([
        prisma.reflection.count({
          where: {
            ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
            ...(filters?.endDate && { createdAt: { lte: filters.endDate } }),
          },
        }),
        prisma.user.count({
          where: {
            role: 'TEACHER',
            ...(filters?.region && {
              school: {
                district: filters.region,
              },
            }),
          },
        }),
        prisma.cluster.count({
          where: {
            ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
          },
        }),
        prisma.trainingModule.count({
          where: {
            isActive: true,
          },
        }),
      ]);

      const avgSentimentResult = await prisma.reflection.aggregate({
        _avg: {
          sentiment: true,
        },
        where: {
          sentiment: { not: null },
          ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
          ...(filters?.endDate && { createdAt: { lte: filters.endDate } }),
        },
      });

      const completedTrainings = await prisma.userTraining.count({
        where: {
          completedAt: { not: null },
          ...(filters?.startDate && { completedAt: { gte: filters.startDate } }),
        },
      });

      const totalTrainings = await prisma.userTraining.count({
        where: {
          ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
        },
      });

      return {
        totalEntries: entries,
        totalTeachers: teachers,
        avgSentiment: avgSentimentResult._avg.sentiment || 0,
        clustersGenerated: clusters,
        modulesDispatched: modules,
        completionRate: totalTrainings > 0 ? completedTrainings / totalTrainings : 0,
      };
    } catch (error) {
      logger.error('Error calculating impact', error);
      throw error;
    }
  }

  /**
   * Save clusters to database
   */
  private async saveClusters(clusters: ClusterResult[]): Promise<void> {
    try {
      for (const cluster of clusters) {
        await prisma.cluster.upsert({
          where: { id: cluster.id },
          update: {
            title: cluster.title,
            description: cluster.description,
            priority: cluster.priority,
            teacherCount: cluster.frequency,
            updatedAt: new Date(),
          },
          create: {
            id: cluster.id,
            title: cluster.title,
            description: cluster.description,
            keywords: [],
            priority: cluster.priority,
            teacherCount: cluster.frequency,
            isActive: true,
          },
        });

        // Link entries to cluster
        for (const entryId of cluster.entryIds) {
          await prisma.clusterReflection.upsert({
            where: {
              clusterId_reflectionId: {
                clusterId: cluster.id,
                reflectionId: entryId,
              },
            },
            update: {},
            create: {
              clusterId: cluster.id,
              reflectionId: entryId,
              similarity: 0.8, // Default similarity
            },
          });
        }
      }
    } catch (error) {
      logger.error('Error saving clusters', error);
    }
  }
}

export const clusteringService = new ClusteringService();
