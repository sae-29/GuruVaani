// Shared types for Guru Vaani AI-Powered Platform

export enum UserRole {
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  MENTOR = 'MENTOR',
  PRINCIPAL = 'PRINCIPAL',
  DIET_OFFICIAL = 'DIET_OFFICIAL',
  SCERT_OFFICIAL = 'SCERT_OFFICIAL',
}

export enum ReflectionType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  PROJECT_BASED = 'PROJECT_BASED',
  INCIDENT_BASED = 'INCIDENT_BASED',
  CHALLENGE_FOCUSED = 'CHALLENGE_FOCUSED',
}

export enum ReflectionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  AI_ANALYZED = 'AI_ANALYZED',
  CLUSTERED = 'CLUSTERED',
  TRAINING_SENT = 'TRAINING_SENT',
  RESOLVED = 'RESOLVED',
  ARCHIVED = 'ARCHIVED',
}

export enum EntryMode {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  MIXED = 'MIXED',
}

export enum TrainingFormat {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  TEXT = 'TEXT',
  INTERACTIVE = 'INTERACTIVE',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
}

export enum ClusterPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum NotificationChannel {
  PUSH = 'PUSH',
  SMS = 'SMS',
  USSD = 'USSD',
  IN_APP = 'IN_APP',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Teacher-specific fields
  employeeId?: string;
  subjects: string[];
  grades: string[];
  experience?: number;
  qualifications?: string;
  preferredLanguage: string;

  // Engagement metrics
  lastActiveAt?: string;
  totalReflections: number;
  completedTrainings: number;
  streakDays: number;
  nepHours: number;

  // Relations
  schoolId?: string;
  school?: School;
  badges?: UserBadge[];
}

export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  district: string;
  block: string;
  pincode: string;
  phoneNumber?: string;
  email?: string;
  principalId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reflection {
  id: string;
  title?: string;
  content: string;
  entryMode: EntryMode;
  audioUrl?: string;
  transcript?: string;
  type: ReflectionType;
  status: ReflectionStatus;

  // Context tagging
  grade?: string;
  subject?: string;
  topic?: string;
  tags: string[];

  // AI analysis
  sentiment?: number;
  keywords: string[];
  priority: ClusterPriority;

  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  analyzedAt?: string;
  resolvedAt?: string;

  // Relations
  authorId: string;
  author?: User;
  schoolId?: string;
  school?: School;
  comments?: Comment[];
  attachments?: Attachment[];
  analytics?: ReflectionAnalytics;
}

export interface Cluster {
  id: string;
  title: string;
  description?: string;
  keywords: string[];
  priority: ClusterPriority;
  teacherCount: number;
  confidence?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;

  // Relations
  reflections?: ClusterReflection[];
  trainings?: ClusterTraining[];
}

export interface ClusterReflection {
  id: string;
  clusterId: string;
  reflectionId: string;
  similarity?: number;
  cluster?: Cluster;
  reflection?: Reflection;
}

export interface ClusterTraining {
  id: string;
  clusterId: string;
  trainingId: string;
  relevance?: number;
  cluster?: Cluster;
  training?: TrainingModule;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content?: string;
  format: TrainingFormat;
  duration: number;

  // Media files
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;

  // Metadata
  subjects: string[];
  grades: string[];
  topics: string[];
  difficulty: string;
  language: string;
  nepCompetencies: string[];

  // Engagement metrics
  viewCount: number;
  completionRate: number;
  avgRating: number;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface UserTraining {
  id: string;
  userId: string;
  trainingId: string;
  startedAt?: string;
  completedAt?: string;
  rating?: number;
  feedback?: string;
  timeSpent?: number;

  user?: User;
  training?: TrainingModule;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  criteria: any; // JSON criteria
  nepHours: number;
  createdAt: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  user?: User;
  badge?: Badge;
}

export interface Comment {
  id: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations
  authorId: string;
  author?: User;
  reflectionId: string;
}

export interface Attachment {
  id: string;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isCompressed: boolean;
  createdAt: string;
  reflectionId: string;
}

export interface ReflectionAnalytics {
  id: string;
  wordCount: number;
  readingTime: number;
  sentimentScore?: number;
  emotionScores?: any; // JSON emotion analysis
  keyThemes: string[];
  improvementAreas: string[];
  urgencyIndicators: string[];
  embedding?: any; // Vector representation
  createdAt: string;
  updatedAt: string;
  reflectionId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  targetRole?: UserRole;
  subjects: string[];
  grades: string[];
  districts: string[];
  blocks: string[];
  scheduledAt?: string;
  sentAt?: string;
  expiresAt?: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  phoneNumber?: string;
  employeeId?: string;
  subjects?: string[];
  grades?: string[];
  schoolId?: string;
  preferredLanguage?: string;
}

// Reflection types
export interface CreateReflectionRequest {
  title?: string;
  content: string;
  entryMode: EntryMode;
  audioUrl?: string;
  type: ReflectionType;
  grade?: string;
  subject?: string;
  topic?: string;
  tags?: string[];
  isPrivate?: boolean;
}

export interface UpdateReflectionRequest {
  title?: string;
  content?: string;
  type?: ReflectionType;
  grade?: string;
  subject?: string;
  topic?: string;
  tags?: string[];
  isPrivate?: boolean;
  status?: ReflectionStatus;
}

// AI Analysis types
export interface AIAnalysisResult {
  sentiment: number;
  keywords: string[];
  themes: string[];
  urgencyIndicators: string[];
  suggestedClusters: Array<{
    clusterId: string;
    title: string;
    similarity: number;
  }>;
  recommendedTrainings: Array<{
    trainingId: string;
    title: string;
    relevance: number;
  }>;
}

// Training types
export interface CreateTrainingRequest {
  title: string;
  description: string;
  content?: string;
  format: TrainingFormat;
  duration: number;
  subjects: string[];
  grades: string[];
  topics: string[];
  difficulty: string;
  language: string;
  nepCompetencies: string[];
}

export interface TrainingDispatchRequest {
  trainingId: string;
  recipients: {
    userIds?: string[];
    clusterIds?: string[];
    filters?: {
      subjects?: string[];
      grades?: string[];
      districts?: string[];
      blocks?: string[];
    };
  };
  notification: {
    channels: NotificationChannel[];
    customMessage?: string;
    scheduledAt?: string;
  };
}

// Analytics types
export interface DashboardStats {
  totalReflections: number;
  totalTeachers: number;
  totalSchools: number;
  reflectionsThisMonth: number;
  averageReflectionsPerTeacher: number;
  completionRate: number;
  avgSatisfaction: number;
  topChallenges: Array<{
    theme: string;
    count: number;
    percentage: number;
  }>;
  urgentClusters: Array<{
    id: string;
    title: string;
    teacherCount: number;
    priority: ClusterPriority;
  }>;
}

export interface EngagementMetrics {
  daily: Array<{
    date: string;
    entries: number;
    completions: number;
    activeUsers: number;
  }>;
  weekly: Array<{
    week: string;
    entries: number;
    completions: number;
    activeUsers: number;
  }>;
  monthly: Array<{
    month: string;
    entries: number;
    completions: number;
    activeUsers: number;
  }>;
}

export interface GeographicInsights {
  districts: Array<{
    name: string;
    activeTeachers: number;
    engagementRate: number;
    completionRate: number;
    topChallenges: string[];
  }>;
  blocks: Array<{
    name: string;
    district: string;
    activeTeachers: number;
    engagementRate: number;
    completionRate: number;
  }>;
}

export interface TrainingEffectiveness {
  modules: Array<{
    id: string;
    title: string;
    completionRate: number;
    avgRating: number;
    impactScore: number; // Before/after improvement
    feedbackSentiment: number;
  }>;
  beforeAfterAnalysis: Array<{
    clusterId: string;
    clusterTitle: string;
    beforeCount: number;
    afterCount: number;
    improvementPercentage: number;
  }>;
}