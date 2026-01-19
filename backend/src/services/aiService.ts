import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface AIAnalysisResult {
  sentiment: number; // -1 to 1
  keywords: string[];
  themes: string[];
  urgencyIndicators: string[];
  embedding?: number[]; // Vector representation
  confidence: number;
}

export interface ClusterResult {
  clusterId: string;
  title: string;
  reflectionIds: string[];
  keywords: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
}

export interface TrainingRecommendation {
  trainingId: string;
  relevanceScore: number;
  reasoning: string;
}

class AIService {
  /**
   * Analyze a reflection entry using NLP
   */
  async analyzeReflection(content: string, context?: {
    grade?: string;
    subject?: string;
    topic?: string;
  }): Promise<AIAnalysisResult> {
    try {
      logger.info('Starting AI analysis for reflection', { contentLength: content.length });

      // Simulate AI analysis - In production, this would call actual ML models
      const analysis = await this.performNLPAnalysis(content, context);
      
      // Store analytics in database (removed unused variable)
      const wordCount = content.split(' ').length;
      const readingTime = Math.ceil(content.split(' ').length / 200); // ~200 WPM

      logger.info('AI analysis completed', { 
        sentiment: analysis.sentiment,
        keywordCount: analysis.keywords.length,
        confidence: analysis.confidence 
      });

      return analysis;
    } catch (error) {
      logger.error('Error in AI analysis', error);
      throw new Error('Failed to analyze reflection');
    }
  }

  /**
   * Perform clustering on recent reflections
   */
  async performClustering(timeframe: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<ClusterResult[]> {
    try {
      logger.info('Starting reflection clustering', { timeframe });

      // Get recent reflections that need clustering
      const cutoffDate = this.getTimeframeCutoff(timeframe);
      const reflections = await prisma.reflection.findMany({
        where: {
          createdAt: { gte: cutoffDate },
          status: { in: ['SUBMITTED', 'AI_ANALYZED'] },
        },
        include: {
          analytics: true,
          author: {
            select: { subjects: true, grades: true }
          }
        }
      });

      if (reflections.length < 2) {
        logger.info('Insufficient reflections for clustering');
        return [];
      }

      // Perform semantic clustering
      const clusters = await this.semanticClustering(reflections);
      
      // Update reflection statuses
      await this.updateReflectionClusters(clusters);

      logger.info('Clustering completed', { 
        reflectionCount: reflections.length,
        clusterCount: clusters.length 
      });

      return clusters;
    } catch (error) {
      logger.error('Error in clustering', error);
      throw new Error('Failed to perform clustering');
    }
  }

  /**
   * Get training recommendations for a reflection or cluster
   */
  async getTrainingRecommendations(
    reflectionId?: string,
    clusterId?: string
  ): Promise<TrainingRecommendation[]> {
    try {
      let context: any = {};

      if (reflectionId) {
        const reflection = await prisma.reflection.findUnique({
          where: { id: reflectionId },
          include: { analytics: true }
        });
        if (!reflection) throw new Error('Reflection not found');
        context = {
          keywords: reflection.analytics?.keyThemes || [],
          subject: reflection.subject,
          grade: reflection.grade,
          sentiment: reflection.sentiment,
        };
      } else if (clusterId) {
        const cluster = await prisma.cluster.findUnique({
          where: { id: clusterId },
          include: {
            reflections: {
              include: { reflection: true }
            }
          }
        });
        if (!cluster) throw new Error('Cluster not found');
        context = {
          keywords: cluster.keywords,
          priority: cluster.priority,
          teacherCount: cluster.teacherCount,
        };
      }

      // Get available training modules
      const modules = await prisma.trainingModule.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          subjects: true,
          grades: true,
          topics: true,
          avgRating: true,
          completionRate: true,
        }
      });

      // Calculate relevance scores
      const recommendations = modules
        .map(module => ({
          trainingId: module.id,
          relevanceScore: this.calculateRelevanceScore(context, module),
          reasoning: this.generateRecommendationReasoning(context, module),
        }))
        .filter(rec => rec.relevanceScore > 0.3) // Minimum threshold
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 5); // Top 5 recommendations

      logger.info('Generated training recommendations', { 
        count: recommendations.length,
        topScore: recommendations[0]?.relevanceScore 
      });

      return recommendations;
    } catch (error) {
      logger.error('Error generating recommendations', error);
      throw new Error('Failed to generate training recommendations');
    }
  }

  /**
   * Detect urgent issues that need immediate attention
   */
  async detectUrgentIssues(): Promise<Array<{
    type: 'burnout' | 'systematic' | 'critical_mass';
    description: string;
    affectedTeachers: number;
    recommendedAction: string;
    priority: 'HIGH' | 'CRITICAL';
  }>> {
    try {
      const issues: Array<{
        type: 'burnout' | 'systematic' | 'critical_mass';
        description: string;
        affectedTeachers: number;
        recommendedAction: string;
        priority: 'HIGH' | 'CRITICAL';
      }> = [];

      // Check for teacher burnout indicators
      const burnoutKeywords = ['exhausted', 'overwhelmed', 'stressed', 'burnout', 'quit', 'tired'];
      const recentBurnoutEntries = await prisma.reflection.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
          OR: burnoutKeywords.map(keyword => ({
            content: { contains: keyword, mode: 'insensitive' }
          }))
        },
        include: { author: true }
      });

      if (recentBurnoutEntries.length >= 3) {
        issues.push({
          type: 'burnout' as const,
          description: `${recentBurnoutEntries.length} teachers showing signs of burnout`,
          affectedTeachers: recentBurnoutEntries.length,
          recommendedAction: 'Deploy wellness resources and reduce workload',
          priority: 'CRITICAL' as const,
        });
      }

      // Check for systematic issues (same problem across many teachers)
      const clusters = await prisma.cluster.findMany({
        where: {
          isActive: true,
          teacherCount: { gte: 15 }, // 15+ teachers with same issue
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      });

      for (const cluster of clusters) {
        if (cluster.teacherCount >= 20) {
          issues.push({
            type: 'systematic' as const,
            description: `${cluster.title}: ${cluster.teacherCount} teachers affected`,
            affectedTeachers: cluster.teacherCount,
            recommendedAction: 'Deploy targeted training intervention',
            priority: cluster.teacherCount >= 30 ? 'CRITICAL' as const : 'HIGH' as const,
          });
        }
      }

      logger.info('Urgent issues detected', { issueCount: issues.length });
      return issues;
    } catch (error) {
      logger.error('Error detecting urgent issues', error);
      return [];
    }
  }

  // Private helper methods

  private async performNLPAnalysis(content: string, context?: any): Promise<AIAnalysisResult> {
    // Simulate NLP analysis - In production, integrate with:
    // - Hugging Face Transformers
    // - Google Cloud Natural Language API
    // - Azure Cognitive Services
    // - Custom trained models

    const words = content.toLowerCase().split(/\s+/);
    
    // Sentiment analysis (simplified)
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'successful', 'effective'];
    const negativeWords = ['difficult', 'struggling', 'confused', 'frustrated', 'failed', 'problem'];
    
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    const sentiment = (positiveCount - negativeCount) / Math.max(words.length / 10, 1);
    const normalizedSentiment = Math.max(-1, Math.min(1, sentiment));

    // Keyword extraction (simplified)
    const educationalKeywords = [
      'division', 'fractions', 'multiplication', 'reading', 'writing', 'science',
      'classroom', 'students', 'learning', 'teaching', 'assessment', 'behavior'
    ];
    const keywords = words.filter(word => educationalKeywords.includes(word));

    // Theme extraction
    const themes = this.extractThemes(content, context);

    // Urgency indicators
    const urgencyKeywords = ['urgent', 'immediate', 'crisis', 'emergency', 'help', 'exam tomorrow'];
    const urgencyIndicators = words.filter(word => urgencyKeywords.some(uk => word.includes(uk)));

    // Generate embedding (simplified - in production use actual embeddings)
    const embedding = this.generateSimpleEmbedding(content);

    return {
      sentiment: normalizedSentiment,
      keywords: [...new Set(keywords)], // Remove duplicates
      themes,
      urgencyIndicators,
      embedding,
      confidence: 0.75 + Math.random() * 0.2, // Simulate confidence score
    };
  }

  private extractThemes(content: string, _context?: any): string[] {
    const themes: string[] = [];
    const lowerContent = content.toLowerCase();

    // Math themes
    if (lowerContent.includes('division') || lowerContent.includes('fractions')) {
      themes.push('Math Concepts');
    }
    if (lowerContent.includes('multiplication') || lowerContent.includes('tables')) {
      themes.push('Basic Operations');
    }

    // Classroom management themes
    if (lowerContent.includes('noise') || lowerContent.includes('discipline')) {
      themes.push('Classroom Management');
    }
    if (lowerContent.includes('attention') || lowerContent.includes('focus')) {
      themes.push('Student Engagement');
    }

    // Assessment themes
    if (lowerContent.includes('test') || lowerContent.includes('exam') || lowerContent.includes('assessment')) {
      themes.push('Assessment Methods');
    }

    return themes;
  }

  private extractImprovementAreas(content: string): string[] {
    const areas: string[] = [];
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('visual') || lowerContent.includes('picture')) {
      areas.push('Visual Learning Aids');
    }
    if (lowerContent.includes('practice') || lowerContent.includes('exercise')) {
      areas.push('Practice Activities');
    }
    if (lowerContent.includes('explain') || lowerContent.includes('understand')) {
      areas.push('Conceptual Understanding');
    }

    return areas;
  }

  private generateSimpleEmbedding(content: string): number[] {
    // Simplified embedding generation - in production use actual models
    const words = content.toLowerCase().split(/\s+/);
    const embedding = new Array(128).fill(0);
    
    words.forEach((word) => {
      const hash = this.simpleHash(word);
      embedding[hash % 128] += 1;
    });

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private async semanticClustering(reflections: any[]): Promise<ClusterResult[]> {
    // Simplified clustering - in production use proper clustering algorithms
    const clusters: ClusterResult[] = [];
    const processed = new Set<string>();

    for (const reflection of reflections) {
      if (processed.has(reflection.id)) continue;

      const similar = reflections.filter(r => 
        !processed.has(r.id) && 
        this.calculateSimilarity(reflection, r) > 0.7
      );

      if (similar.length >= 2) {
        const keywords = this.extractCommonKeywords(similar);
        const title = this.generateClusterTitle(keywords, similar[0].subject);
        
        const cluster: ClusterResult = {
          clusterId: `cluster_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          title,
          reflectionIds: similar.map(r => r.id),
          keywords,
          priority: this.determinePriority(similar),
          confidence: 0.8 + Math.random() * 0.15,
        };

        clusters.push(cluster);
        similar.forEach(r => processed.add(r.id));
      }
    }

    return clusters;
  }

  private calculateSimilarity(r1: any, r2: any): number {
    // Simplified similarity calculation
    const keywords1 = r1.analytics?.keyThemes || [];
    const keywords2 = r2.analytics?.keyThemes || [];
    
    const intersection = keywords1.filter((k: string) => keywords2.includes(k));
    const union = [...new Set([...keywords1, ...keywords2])];
    
    const jaccardSimilarity = union.length > 0 ? intersection.length / union.length : 0;
    
    // Boost similarity if same subject/grade
    let boost = 1;
    if (r1.subject === r2.subject) boost += 0.2;
    if (r1.grade === r2.grade) boost += 0.1;
    
    return Math.min(1, jaccardSimilarity * boost);
  }

  private extractCommonKeywords(reflections: any[]): string[] {
    const keywordCounts = new Map<string, number>();
    
    reflections.forEach(r => {
      const keywords = r.analytics?.keyThemes || [];
      keywords.forEach((keyword: string) => {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
      });
    });

    return Array.from(keywordCounts.entries())
      .filter(([_, count]) => count >= Math.ceil(reflections.length * 0.5))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword]) => keyword);
  }

  private generateClusterTitle(keywords: string[], subject?: string): string {
    if (keywords.length === 0) return 'General Teaching Challenge';
    
    const primaryKeyword = keywords[0];
    const subjectPrefix = subject ? `${subject} - ` : '';
    
    return `${subjectPrefix}${primaryKeyword} Issues`;
  }

  private determinePriority(reflections: any[]): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const count = reflections.length;
    const avgSentiment = reflections.reduce((sum, r) => sum + (r.sentiment || 0), 0) / count;
    
    if (count >= 20 || avgSentiment < -0.5) return 'CRITICAL';
    if (count >= 10 || avgSentiment < -0.2) return 'HIGH';
    if (count >= 5) return 'MEDIUM';
    return 'LOW';
  }

  private calculateRelevanceScore(context: any, module: any): number {
    let score = 0;

    // Subject match
    if (context.subject && module.subjects.includes(context.subject)) {
      score += 0.4;
    }

    // Grade match
    if (context.grade && module.grades.includes(context.grade)) {
      score += 0.3;
    }

    // Keyword overlap
    const contextKeywords = context.keywords || [];
    const moduleTopics = module.topics || [];
    const overlap = contextKeywords.filter((k: string) => 
      moduleTopics.some((t: string) => t.toLowerCase().includes(k.toLowerCase()))
    );
    score += (overlap.length / Math.max(contextKeywords.length, 1)) * 0.2;

    // Quality factors
    score += (module.avgRating / 5) * 0.05;
    score += (module.completionRate / 100) * 0.05;

    return Math.min(1, score);
  }

  private generateRecommendationReasoning(context: any, module: any): string {
    const reasons: string[] = [];
    
    if (context.subject && module.subjects.includes(context.subject)) {
      reasons.push(`matches ${context.subject} subject`);
    }
    
    if (context.grade && module.grades.includes(context.grade)) {
      reasons.push(`appropriate for grade ${context.grade}`);
    }
    
    if (module.avgRating >= 4.5) {
      reasons.push('highly rated by teachers');
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'general relevance to teaching challenges';
  }

  private async updateReflectionClusters(clusters: ClusterResult[]): Promise<void> {
    for (const cluster of clusters) {
      // Create cluster in database
      const dbCluster = await prisma.cluster.create({
        data: {
          title: cluster.title,
          keywords: cluster.keywords,
          priority: cluster.priority,
          teacherCount: cluster.reflectionIds.length,
          confidence: cluster.confidence,
        }
      });

      // Update reflections
      await prisma.reflection.updateMany({
        where: { id: { in: cluster.reflectionIds } },
        data: { status: 'CLUSTERED' }
      });

      // Create cluster-reflection relationships
      const clusterReflections = cluster.reflectionIds.map(reflectionId => ({
        clusterId: dbCluster.id,
        reflectionId,
        similarity: 0.8 + Math.random() * 0.2, // Simulate similarity scores
      }));

      await prisma.clusterReflection.createMany({
        data: clusterReflections
      });
    }
  }

  private getTimeframeCutoff(timeframe: 'daily' | 'weekly' | 'monthly'): Date {
    const now = new Date();
    switch (timeframe) {
      case 'daily':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }
}

export const aiService = new AIService();