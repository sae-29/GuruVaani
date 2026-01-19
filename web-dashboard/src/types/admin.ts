/**
 * Admin Dashboard Types
 */

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'DIET_ADMIN' | 'SCERT_ADMIN' | 'BLOCK_COORDINATOR';
  district?: string;
  block?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DiaryEntry {
  id: string;
  authorId: string;
  title?: string;
  content: string;
  transcript?: string;
  audioUrl?: string;
  entryMode: 'TEXT' | 'VOICE' | 'MIXED';
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  status: 'DRAFT' | 'SUBMITTED' | 'AI_ANALYZED' | 'REVIEWED';
  grade?: string;
  subject?: string;
  topic?: string;
  tags?: string[];
  sentiment?: number;
  keywords?: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  analyzedAt?: Date;
  resolvedAt?: Date;
}

export interface Cluster {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  teacherCount: number;
  confidence?: number;
  frequency: number;
  avgSentiment: number;
  entryIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content?: string;
  format: 'VIDEO' | 'AUDIO' | 'TEXT' | 'INTERACTIVE';
  duration: number; // minutes
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  subjects?: string[];
  grades?: string[];
  topics?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  nepCompetencies?: string[];
  viewCount: number;
  completionRate: number;
  avgRating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface DispatchJob {
  id: string;
  moduleId: string;
  recipientCount: number;
  sentCount: number;
  openedCount: number;
  completedCount: number;
  avgRating?: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'TRAINING_ASSIGNED' | 'MODULE_COMPLETED' | 'CLUSTER_ALERT' | 'GENERAL';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channels: ('PUSH' | 'SMS' | 'IN_APP')[];
  isRead: boolean;
  createdAt: Date;
}

export interface DashboardMetrics {
  totalTeachers: number;
  activeTeachers: number;
  entriesThisWeek: number;
  completionRate: number;
  avgSatisfaction: number;
  criticalAlerts: number;
}

export interface FilterOptions {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  subjects?: string[];
  grades?: string[];
  blocks?: string[];
  entryType?: 'TEXT' | 'VOICE' | 'ALL';
  status?: string;
  searchQuery?: string;
}
