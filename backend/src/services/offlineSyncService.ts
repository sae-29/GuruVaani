/**
 * Offline Sync Service
 * Handles batch uploads from offline clients and reconciliation
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { grokService } from './grokService';

const prisma = new PrismaClient();

interface SyncEntry {
  id: string; // Client-generated ID
  textContent?: string;
  audioUrl?: string;
  transcript?: string;
  grade?: string;
  subject?: string;
  topicTags?: string[];
  language?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  syncStatus?: 'pending' | 'synced' | 'conflict';
}

interface SyncBatch {
  entries: SyncEntry[];
  deviceId: string;
  lastSyncTimestamp?: string;
}

interface SyncResult {
  synced: string[];
  conflicts: Array<{
    clientId: string;
    serverId: string;
    reason: string;
  }>;
  errors: Array<{
    clientId: string;
    error: string;
  }>;
}

class OfflineSyncService {
  /**
   * Process batch sync from offline client
   */
  async processBatchSync(
    userId: string,
    batch: SyncBatch
  ): Promise<SyncResult> {
    const result: SyncResult = {
      synced: [],
      conflicts: [],
      errors: [],
    };

    try {
      // Get user's last sync timestamp
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { lastActiveAt: true },
      });

      const lastSync = user?.lastActiveAt
        ? new Date(user.lastActiveAt)
        : batch.lastSyncTimestamp
          ? new Date(batch.lastSyncTimestamp)
          : null;

      // Process each entry
      for (const entry of batch.entries) {
        try {
          // Check for conflicts (entry modified on server after client's last sync)
          const existingEntry = await prisma.reflection.findFirst({
            where: {
              authorId: userId,
              createdAt: {
                gte: lastSync || new Date(0),
              },
            },
            orderBy: { createdAt: 'desc' },
          });

          if (existingEntry && this.hasConflict(entry, existingEntry, lastSync)) {
            result.conflicts.push({
              clientId: entry.id,
              serverId: existingEntry.id,
              reason: 'Entry was modified on server after last sync',
            });
            continue;
          }

          // Create or update entry
          const savedEntry = await this.saveEntry(userId, entry);
          result.synced.push(savedEntry.id);

          // Trigger AI analysis asynchronously
          this.analyzeEntryAsync(savedEntry.id).catch(err => {
            logger.error(`Failed to analyze entry ${savedEntry.id}`, err);
          });

        } catch (error) {
          logger.error(`Error processing entry ${entry.id}`, error);
          result.errors.push({
            clientId: entry.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      // Update user's last active timestamp
      await prisma.user.update({
        where: { id: userId },
        data: { lastActiveAt: new Date() },
      });

      return result;
    } catch (error) {
      logger.error('Error processing batch sync', error);
      throw error;
    }
  }

  /**
   * Save entry to database
   */
  private async saveEntry(userId: string, entry: SyncEntry) {
    const content = entry.transcript || entry.textContent || '';

    // Get user's school
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { schoolId: true },
    });

    return await prisma.reflection.create({
      data: {
        title: this.generateTitle(content),
        content: content,
        entryMode: entry.audioUrl ? 'VOICE' : 'TEXT',
        audioUrl: entry.audioUrl,
        transcript: entry.transcript || entry.textContent,
        grade: entry.grade,
        subject: entry.subject,
        topic: entry.topicTags?.[0],
        tags: entry.topicTags || [],
        status: 'SUBMITTED',
        authorId: userId,
        schoolId: user?.schoolId || null,
        submittedAt: new Date(entry.createdAt),
      },
    });
  }

  /**
   * Check for conflicts
   */
  private hasConflict(
    clientEntry: SyncEntry,
    serverEntry: any,
    lastSync: Date | null
  ): boolean {
    if (!lastSync) return false;

    const serverUpdated = new Date(serverEntry.updatedAt);
    const clientCreated = new Date(clientEntry.createdAt);

    // Conflict if server entry was updated after client's last sync
    // and client entry was created before that update
    return serverUpdated > lastSync && clientCreated < serverUpdated;
  }

  /**
   * Analyze entry asynchronously
   */
  private async analyzeEntryAsync(entryId: string): Promise<void> {
    try {
      const entry = await prisma.reflection.findUnique({
        where: { id: entryId },
        select: {
          content: true,
          transcript: true,
          grade: true,
          subject: true,
          tags: true,
        },
      });

      if (!entry) return;

      // Get AI analysis
      const aiResponse = await grokService.generateTeacherResponse({
        diaryText: entry.transcript || entry.content,
        grade: entry.grade || undefined,
        subject: entry.subject || undefined,
        language: 'en', // TODO: Detect language
      });

      // Extract sentiment (simple heuristic)
      const sentiment = this.calculateSentiment(entry.content);

      // Update entry with AI analysis
      await prisma.reflection.update({
        where: { id: entryId },
        data: {
          sentiment: sentiment,
          keywords: this.extractKeywords(entry.content),
          status: 'AI_ANALYZED',
          analyzedAt: new Date(),
        },
      });

      // Create analytics record
      await prisma.reflectionAnalytics.create({
        data: {
          reflectionId: entryId,
          wordCount: entry.content.split(/\s+/).length,
          readingTime: Math.ceil(entry.content.split(/\s+/).length / 200), // ~200 words per minute
          sentimentScore: sentiment,
          keyThemes: aiResponse.tips,
        },
      });

    } catch (error) {
      logger.error(`Error analyzing entry ${entryId}`, error);
    }
  }

  /**
   * Generate title from content
   */
  private generateTitle(content: string): string {
    const words = content.split(/\s+/).slice(0, 8);
    return words.join(' ') + (content.split(/\s+/).length > 8 ? '...' : '');
  }

  /**
   * Calculate sentiment score (-1 to 1)
   */
  private calculateSentiment(text: string): number {
    // Simple sentiment analysis (can be replaced with better NLP)
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'success', 'improve', 'better'];
    const negativeWords = ['difficult', 'struggle', 'problem', 'frustrated', 'challenge', 'hard', 'failed'];

    const lowerText = text.toLowerCase();
    let score = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 0.1;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 0.1;
    });

    return Math.max(-1, Math.min(1, score));
  }

  /**
   * Extract keywords from content
   */
  private extractKeywords(text: string): string[] {
    // Simple keyword extraction (can be improved)
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const frequency: Record<string, number> = {};

    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }
}

export const offlineSyncService = new OfflineSyncService();
