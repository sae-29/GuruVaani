/**
 * GURU VAANI ADMIN DASHBOARD - COMPREHENSIVE TYPES
 * Includes all 9 screens and component specifications
 */

// ============================================
// USERS & AUTHENTICATION
// ============================================

export interface Admin {
  id: string;
  username: string;
  email: string;
  district: string;
  role: 'super_admin' | 'district_admin' | 'block_admin';
  avatar?: string;
  lastLogin: string;
}

export interface Teacher {
  id: string;
  name: string;
  schoolName: string;
  block: string;
  subject: string;
  grade: string | string[];
  email: string;
  phone: string;
  entriesCount: number;
  lastActive: string;
  satisfactionRating: number;
  status: 'active' | 'inactive' | 'archived';
}

// ============================================
// DIARY ENTRIES
// ============================================

export interface DiaryEntry {
  id: string;
  teacherId: string;
  teacherName: string;
  schoolName: string;
  block: string;
  grade: string;
  subject: string;
  date: string;
  type: 'text' | 'voice';
  content: string;
  transcript?: string;
  audioUrl?: string;
  photoUrl?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  keywords: string[];
  tags: string[];
  clusterId?: string;
  status: 'unreviewed' | 'tagged' | 'in_progress' | 'resolved' | 'archived';
  aiInsights?: AIInsights;
}

export interface AIInsights {
  summary: string;
  suggestedCluster: string;
  matchScore: number;
  suggestedTrainings: string[];
  priorityLevel: 'low' | 'medium' | 'high';
  similarEntriesCount: number;
}

export interface EntryFilter {
  dateRange?: { start: string; end: string };
  subjects?: string[];
  grades?: string[];
  blocks?: string[];
  type?: 'text' | 'voice' | 'all';
  status?: string;
  searchQuery?: string;
  clusterId?: string;
}

// ============================================
// CLUSTERS
// ============================================

export interface Cluster {
  id: string;
  title: string;
  description?: string;
  teacherCount: number;
  teacherIds: string[];
  subjectCounts: Record<string, number>;
  gradeCounts: Record<string, number>;
  blockCounts: Record<string, number>;
  keywords: string[];
  firstReported: string;
  lastUpdated: string;
  entriesCount: number;
  urgencyLevel: 'low' | 'medium' | 'high';
  trendThisWeek: number;
  sampleEntrySnippet: string;
  suggestedTrainingModuleId?: string;
  suggestedTrainingRelevance?: number;
  aiInsights?: ClusterAIInsights;
}

export interface ClusterAIInsights {
  painPoints: string[];
  recommendations: string[];
  estimatedImpact: {
    teacherCount: number;
    studentCount: number;
  };
}

export interface ClusterSettings {
  aiModel: 'semantic' | 'keyword' | 'topic_modeling';
  sensitivity: number;
  timePeriod: 'last_7_days' | 'last_30_days' | 'all_time';
  subjectFilters?: string[];
}

// ============================================
// TRAINING MODULES
// ============================================

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  durationMinutes: number;
  subject: string;
  grades: string[];
  topics: string[];
  languages: string[];
  format: 'video' | 'audio' | 'text' | 'external';
  contentUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  richContent?: string;
  subtitles?: string[];
  thumbnailUrl?: string;
  resources?: { name: string; url: string }[];
  hasQuiz: boolean;
  quizQuestions?: QuizQuestion[];
  hasReflection: boolean;
  reflectionPrompt?: string;
  hasActivity: boolean;
  activityDescription?: string;
  activityWorksheetUrl?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  recommendForNew: boolean;
  prerequisites?: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  nepAlignmentTags?: string[];
  copyrightAttribution?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  sentToTeachersCount: number;
  completionCount: number;
  completionRate: number;
  avgRating: number;
  reviewCount: number;
  feedbackThemes?: { theme: string; frequency: number }[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
}

export interface ModuleCreationData {
  step: 1 | 2 | 3 | 4;
  basicInfo?: {
    title: string;
    shortDescription: string;
    fullDescription: string;
    durationMinutes: number;
    subject: string;
    grades: string[];
    topics: string[];
    languages: string[];
    thumbnailUrl?: string;
  };
  content?: {
    format: 'video' | 'audio' | 'text' | 'external';
    contentUrl?: string;
    videoFile?: File;
    audioFile?: File;
    subtitleFiles?: File[];
    resourceFiles?: File[];
  };
  interactive?: {
    hasQuiz: boolean;
    quizQuestions?: QuizQuestion[];
    hasReflection: boolean;
    reflectionPrompt?: string;
    hasActivity: boolean;
    activityDescription?: string;
    activityWorksheetFile?: File;
  };
  publish?: {
    status: 'draft' | 'published';
    featured: boolean;
    recommendForNew: boolean;
    prerequisites?: string[];
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    nepAlignmentTags?: string[];
    copyrightAttribution?: string;
    dispatchImmediately?: boolean;
  };
}

// ============================================
// DISPATCH & NOTIFICATIONS
// ============================================

export interface DispatchJob {
  id: string;
  moduleId: string;
  moduleName: string;
  recipientCount: number;
  recipientTeacherIds: string[];
  recipientFilters?: unknown;
  channels: ('app_push' | 'sms' | 'ussd' | 'in_app')[];
  smsMessage?: string;
  pushTitle?: string;
  pushBody?: string;
  inAppMessage?: string;
  scheduledTime?: string;
  sendImmediately: boolean;
  reminderDaysAfter?: number;
  sendFollowupSurvey: boolean;
  completionDeadline?: string;
  awardCertificate: boolean;
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentAt?: string;
  estimatedCost?: number;
}

export interface DispatchRecipientStatus {
  jobId: string;
  teacherId: string;
  appNotificationSent: boolean;
  appNotificationDelivered: boolean;
  appNotificationOpenedAt?: string;
  smsSent: boolean;
  smsDelivered: boolean;
  inAppShown: boolean;
  moduleStartedAt?: string;
  moduleCompletedAt?: string;
  rating?: number;
  feedback?: string;
  certificateIssuedAt?: string;
  currentStatus: 'pending' | 'delivered' | 'opened' | 'in_progress' | 'completed' | 'failed';
}

export interface DispatchSummary {
  module: TrainingModule;
  recipients: {
    count: number;
    byBlock: Record<string, number>;
    bySubject: Record<string, number>;
  };
  notification: {
    channels: string[];
    sendTime: string;
    followUp?: string;
    deadline?: string;
  };
  estimatedImpact: {
    dataUsageMB: number;
    smsCost?: number;
    budgetRemaining?: number;
    estimatedReachPercentage: number;
  };
}

export interface Notification {
  id: string;
  type: 'cluster_detected' | 'module_dispatched' | 'training_completed' | 'alert' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  icon?: string;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
  read: boolean;
  relatedEntityId?: string;
}

// ============================================
// DASHBOARD METRICS
// ============================================

export interface DashboardMetrics {
  period: string;
  activeTeachers: number;
  activeTeachersTrend: number;
  newEntriesThisWeek: number;
  entriesByType: {
    text: number;
    voice: number;
  };
  trainingCompletionRate: number;
  avgTeacherSatisfaction: number;
  satisfactionTrend: number;
  topChallenges: Array<{
    name: string;
    teacherCount: number;
    percentage: number;
  }>;
  activityByBlock: Record<
    string,
    {
      teacherCount: number;
      entriesCount: number;
    }
  >;
  engagementTrend: Array<{
    date: string;
    entries: number;
    completions: number;
    engagement: number;
  }>;
}

export interface MetricCard {
  icon: string;
  title: string;
  value: number | string;
  trend: number;
  trendColor: 'success' | 'warning' | 'error';
  sparkline?: number[];
  breakdown?: string;
}

export interface FilterOptions {
  districts: Array<{ id: string; name: string }>;
  blocks: Array<{ id: string; name: string }>;
  subjects: string[];
  grades: string[];
  schools?: Array<{ id: string; name: string; block: string }>;
}

// ============================================
// ANALYTICS
// ============================================

export interface AnalyticsData {
  period: string;
  totalEntries: number;
  entriesTrend: number;
  trainingCompletions: number;
  completionRate: number;
  avgTeacherRating: number;
  ratingTrend: number;
  activeTeachers: number;
  activeTeachersTrend: number;
  inactiveTeachers: number;
  engagementFunnel: {
    allTeachers: number;
    madeEntry: number;
    completedTraining: number;
    activeCommunity: number;
    superUser: number;
  };
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sentimentTrend: Array<{
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }>;
  topModules: Array<{
    moduleId: string;
    moduleName: string;
    completionRate: number;
    avgRating: number;
    totalCompletions: number;
    avgTimeMinutes: number;
    impactScore: number;
  }>;
  lowPerformingModules: Array<{
    moduleId: string;
    moduleName: string;
    rating: number;
    commonFeedback: string[];
  }>;
  challengeCategories: Array<{
    category: string;
    volume: number;
  }>;
  challengeTrends: Array<{
    date: string;
    math: number;
    classroom_management: number;
    engagement: number;
    assessment: number;
    other: number;
  }>;
  netPromoterScore: number;
  npsBreakdown: {
    promoters: number;
    passives: number;
    detractors: number;
  };
  trainingImpact: Array<{
    challengeName: string;
    beforeTeachers: number;
    afterTeachers: number;
    reductionPercentage: number;
  }>;
  feedbackThemes: Array<{
    theme: string;
    frequency: number;
  }>;
  teacherFeedback: Array<{
    date: string;
    teacherId: string;
    moduleId: string;
    rating: number;
    comment: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface TableColumn<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
  width?: number;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableState {
  page: number;
  rowsPerPage: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ModalState {
  open: boolean;
  data?: unknown;
}
