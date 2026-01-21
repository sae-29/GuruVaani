/**
 * Grok AI Integration Service
 * Handles all interactions with Grok API for NLP, clustering, and recommendations
 */

import axios from 'axios';
import { logger } from '../utils/logger';
import { redisClient } from '../config/redis';

interface GrokConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface TeacherAIInput {
  diaryText: string;
  transcript?: string;
  grade?: string;
  subject?: string;
  language?: string;
  context?: Record<string, any>;
}

interface TeacherAIOutput {
  acknowledgement: string;
  tips: string[];
  suggestedModules: Array<{
    id: string;
    title: string;
    relevanceScore: number;
    reasoning: string;
  }>;
  similarIssues: Array<{
    count: number;
    description: string;
  }>;
}

interface AdminAIInput {
  entries: Array<{
    id: string;
    content: string;
    grade?: string;
    subject?: string;
    sentiment?: number;
  }>;
  region?: string;
  timeframe?: string;
}

interface AdminAIOutput {
  clusters: Array<{
    id: string;
    title: string;
    description: string;
    entryIds: string[];
    frequency: number;
    avgSentiment: number;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
  alerts: Array<{
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    affectedEntries: string[];
  }>;
  recommendations: Array<{
    clusterId: string;
    suggestedModules: string[];
    reasoning: string;
  }>;
}

class GrokService {
  private config: GrokConfig;
  private cachePrefix = 'grok:';

  constructor() {
    this.config = {
      apiKey: process.env.GROK_API_KEY || '',
      baseUrl: process.env.GROK_API_URL || 'https://api.x.ai/v1',
      model: process.env.GROK_MODEL || 'grok-beta',
    };

    if (!this.config.apiKey) {
      logger.warn('Grok API key not configured. AI features will be limited.');
    }
  }

  /**
   * Generate teacher-side AI response
   */
  async generateTeacherResponse(input: TeacherAIInput): Promise<TeacherAIOutput> {
    const cacheKey = `${this.cachePrefix}teacher:${this.hashInput(input.diaryText)}`;

    // Check cache first
    try {
      if (redisClient && typeof redisClient.get === 'function') {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          logger.info('Returning cached teacher AI response');
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      logger.warn('Redis cache check failed', error);
    }

    const prompt = this.buildTeacherPrompt(input);

    try {
      const response = await this.callGrokAPI(prompt);
      const parsed = this.parseTeacherResponse(response);

      // Cache for 24 hours
      try {
        if (redisClient) {
          await redisClient.setEx(cacheKey, 86400, JSON.stringify(parsed));
        }
      } catch (error) {
        logger.warn('Redis cache set failed', error);
      }

      return parsed;
    } catch (error) {
      logger.error('Grok API error for teacher response', error);
      // Return fallback response
      return this.getFallbackTeacherResponse(input);
    }
  }

  /**
   * Generate admin-side clustering and analytics
   */
  async generateAdminAnalytics(input: AdminAIInput): Promise<AdminAIOutput> {
    const cacheKey = `${this.cachePrefix}admin:${this.hashInput(JSON.stringify(input.entries))}`;

    // Check cache
    try {
      if (redisClient && typeof redisClient.get === 'function') {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          logger.info('Returning cached admin analytics');
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      logger.warn('Redis cache check failed', error);
    }

    const prompt = this.buildAdminPrompt(input);

    try {
      const response = await this.callGrokAPI(prompt);
      const parsed = this.parseAdminResponse(response);

      // Cache for 24 hours
      try {
        if (redisClient) {
          await redisClient.setEx(cacheKey, 86400, JSON.stringify(parsed));
        }
      } catch (error) {
        logger.warn('Redis cache set failed', error);
      }

      return parsed;
    } catch (error) {
      logger.error('Grok API error for admin analytics', error);
      return this.getFallbackAdminResponse(input);
    }
  }

  /**
   * Call Grok API
   */
  private async callGrokAPI(prompt: string): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('Grok API key not configured');
    }

    const response = await axios.post(
      `${this.config.baseUrl}/chat/completions`,
      {
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    return response.data.choices[0]?.message?.content || '';
  }

  /**
   * Build teacher-side prompt
   */
  private buildTeacherPrompt(input: TeacherAIInput): string {
    return `You are Guru Vaani, an empathetic AI mentor for Indian school teachers. Your role is to support teachers in their daily classroom challenges with understanding, practical advice, and encouragement.

Context:
- Grade: ${input.grade || 'Not specified'}
- Subject: ${input.subject || 'Not specified'}
- Language: ${input.language || 'English'}

Teacher's Reflection:
"${input.diaryText || input.transcript || ''}"

Your task:
1. Provide a warm, empathetic acknowledgement (2-3 sentences) that validates their experience
2. Suggest 1-2 practical, actionable tips they can try immediately
3. Recommend 2-3 relevant training modules (if any match)
4. Mention if similar issues have been reported by other teachers (without revealing identities)

Guidelines:
- Be culturally respectful and context-aware
- Avoid judgmental language
- Focus on solutions, not problems
- Use simple, clear language
- Be encouraging and supportive

Respond in JSON format:
{
  "acknowledgement": "...",
  "tips": ["...", "..."],
  "suggestedModules": [
    {
      "id": "module-id",
      "title": "Module Title",
      "relevanceScore": 0.85,
      "reasoning": "Why this module helps"
    }
  ],
  "similarIssues": [
    {
      "count": 15,
      "description": "Brief description of similar issue"
    }
  ]
}`;
  }

  /**
   * Build admin-side prompt
   */
  private buildAdminPrompt(input: AdminAIInput): string {
    const entriesSummary = input.entries.map((e, i) =>
      `Entry ${i + 1}: "${e.content.substring(0, 200)}..." (Grade: ${e.grade || 'N/A'}, Subject: ${e.subject || 'N/A'}, Sentiment: ${e.sentiment || 'N/A'})`
    ).join('\n');

    return `You are an education analytics assistant helping DIET/SCERT officials identify patterns in teacher reflections and recommend interventions.

Region: ${input.region || 'Not specified'}
Timeframe: ${input.timeframe || 'Not specified'}

Teacher Entries (${input.entries.length} total):
${entriesSummary}

Your task:
1. Cluster similar entries by theme/problem
2. Rank clusters by frequency and severity
3. Identify critical alerts (urgent issues needing immediate attention)
4. Suggest training modules for each cluster

Guidelines:
- Group entries by semantic similarity, not just keywords
- Consider sentiment scores when ranking priority
- Flag issues affecting multiple teachers as HIGH priority
- Be specific in cluster descriptions
- Suggest actionable interventions

Respond in JSON format:
{
  "clusters": [
    {
      "id": "cluster-1",
      "title": "Cluster Title",
      "description": "What this cluster represents",
      "entryIds": ["entry-id-1", "entry-id-2"],
      "frequency": 12,
      "avgSentiment": -0.3,
      "priority": "HIGH"
    }
  ],
  "alerts": [
    {
      "type": "CRITICAL_ISSUE",
      "severity": "CRITICAL",
      "message": "Alert description",
      "affectedEntries": ["entry-id-1"]
    }
  ],
  "recommendations": [
    {
      "clusterId": "cluster-1",
      "suggestedModules": ["module-id-1", "module-id-2"],
      "reasoning": "Why these modules help"
    }
  ]
}`;
  }

  /**
   * Parse teacher response from Grok
   */
  private parseTeacherResponse(response: string): TeacherAIOutput {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response;
      return JSON.parse(jsonStr);
    } catch (error) {
      logger.error('Failed to parse teacher response', error);
      return this.getFallbackTeacherResponse({ diaryText: '' });
    }
  }

  /**
   * Parse admin response from Grok
   */
  private parseAdminResponse(response: string): AdminAIOutput {
    try {
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response;
      return JSON.parse(jsonStr);
    } catch (error) {
      logger.error('Failed to parse admin response', error);
      return this.getFallbackAdminResponse({ entries: [] });
    }
  }

  /**
   * Fallback teacher response when API fails
   */
  private getFallbackTeacherResponse(input: TeacherAIInput): TeacherAIOutput {
    return {
      acknowledgement: "Thank you for sharing your reflection. Your dedication to improving your teaching practice is commendable.",
      tips: [
        "Consider breaking down complex concepts into smaller, manageable steps.",
        "Try incorporating visual aids or hands-on activities to enhance understanding.",
      ],
      suggestedModules: [],
      similarIssues: [],
    };
  }

  /**
   * Fallback admin response when API fails
   */
  private getFallbackAdminResponse(input: AdminAIInput): AdminAIOutput {
    return {
      clusters: [],
      alerts: [],
      recommendations: [],
    };
  }

  /**
   * Parse a simple JSON array of strings
   */
  private parseSimpleArray(response: string): string[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      return JSON.parse(jsonStr);
    } catch (error) {
      logger.error('Failed to parse simple array', error);
      return [];
    }
  }

  /**
   * Hash input for cache key
   */
  private hashInput(input: string): string {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

export const grokService = new GrokService();
