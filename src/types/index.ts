/**
 * TypeScript Type Definitions
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Audiobooks: undefined;
  Podcasts: undefined;
  Alarms: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Audio Types
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  artwork?: string;
  category: string;
  description?: string;
  rating?: number;
  playCount?: number;
  isFavorite?: boolean;
  isDownloaded?: boolean;
  downloadProgress?: number;
  tags?: string[];
  genre?: string;
  releaseDate?: Date;
  fileSize?: number;
  bitrate?: number;
  chapters?: AudioChapter[];
}

export interface AudioChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
}

export interface PlaylistTrack extends AudioTrack {
  addedAt: Date;
  addedBy: string;
  position: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  tracks: PlaylistTrack[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  totalDuration: number;
  playCount: number;
  followersCount: number;
}

// User Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username?: string;
  profilePicture?: string;
  bio?: string;
  isPremium: boolean;
  isVerified: boolean;
  preferences: UserPreferences;
  stats: UserStats;
  subscription?: Subscription;
  createdAt: Date;
  lastLoginAt: Date;
  timezone: string;
  language: string;
}

export interface UserPreferences {
  favoriteGenres: string[];
  sleepGoal: number; // hours
  wakeUpTime: string; // HH:MM format
  bedTime: string; // HH:MM format
  enableSmartAlarms: boolean;
  preferredNarrators: string[];
  audioQuality: 'low' | 'medium' | 'high';
  autoDownload: boolean;
  dataUsageLimit: number; // MB
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
}

export interface NotificationPreferences {
  enablePush: boolean;
  enableEmail: boolean;
  newReleases: boolean;
  recommendations: boolean;
  socialActivity: boolean;
  systemUpdates: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'friends' | 'private';
  showListeningActivity: boolean;
  allowDataCollection: boolean;
  personalizedAds: boolean;
  shareUsageData: boolean;
}

export interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  hapticFeedback: boolean;
}

export interface UserStats {
  totalListeningTime: number; // minutes
  sleepSessions: number;
  meditationSessions: number;
  currentStreak: number; // days
  longestStreak: number; // days
  favoriteContent: string[]; // track IDs
  weeklyProgress: number[]; // minutes per day for last 7 days
  monthlyProgress: number[]; // minutes per day for last 30 days
  achievements: Achievement[];
  level: number;
  experiencePoints: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'listening' | 'sleep' | 'meditation' | 'social' | 'premium';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Subscription {
  id: string;
  plan: 'free' | 'premium' | 'family';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
}

// Alarm Types
export interface SmartAlarm {
  id: string;
  time: string; // HH:MM format
  label: string;
  isEnabled: boolean;
  repeatDays: WeekDay[];
  soundId: string;
  soundType: 'nature' | 'music' | 'tone' | 'custom';
  volume: number; // 0-100
  vibration: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number; // minutes
  maxSnoozes: number;
  gradualWakeUp: boolean;
  smartWakeUp: boolean;
  smartWakeUpWindow: number; // minutes before alarm time
  fadeInDuration: number; // minutes
  weatherIntegration: boolean;
  sleepCycleIntegration: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface AlarmSound {
  id: string;
  name: string;
  category: 'nature' | 'music' | 'tone';
  url: string;
  duration: number;
  previewUrl?: string;
  isPremium: boolean;
  isDownloaded: boolean;
  fileSize?: number;
  description?: string;
  tags?: string[];
}

// Sleep Tracking Types
export interface SleepSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  quality: number; // 1-10 scale
  stages: SleepStage[];
  notes?: string;
  mood: 'excellent' | 'good' | 'fair' | 'poor';
  environment: {
    temperature?: number;
    humidity?: number;
    noise?: number;
    light?: number;
  };
  factors: SleepFactor[];
  createdAt: Date;
}

export interface SleepStage {
  stage: 'awake' | 'light' | 'deep' | 'rem';
  startTime: Date;
  duration: number; // minutes
  quality: number; // 1-10 scale
}

export interface SleepFactor {
  type: 'caffeine' | 'alcohol' | 'exercise' | 'stress' | 'screen-time' | 'meal' | 'medication';
  value: number;
  time: Date;
  notes?: string;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  scrim: string;
  shadow: string;
}

export interface CustomTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  isDark: boolean;
  isCustom: boolean;
  createdBy?: string;
  createdAt?: Date;
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  deviceInfo: DeviceInfo;
  appVersion: string;
}

export interface DeviceInfo {
  platform: 'ios' | 'android';
  osVersion: string;
  deviceModel: string;
  screenWidth: number;
  screenHeight: number;
  isTablet: boolean;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Search Types
export interface SearchResult {
  type: 'track' | 'playlist' | 'user' | 'album';
  item: AudioTrack | Playlist | UserProfile;
  relevanceScore: number;
  matchedFields: string[];
}

export interface SearchFilters {
  type?: ('track' | 'playlist' | 'user' | 'album')[];
  category?: string[];
  duration?: {
    min?: number;
    max?: number;
  };
  rating?: {
    min?: number;
    max?: number;
  };
  isPremium?: boolean;
  isDownloaded?: boolean;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

// Recommendation Types
export interface Recommendation {
  id: string;
  type: 'track' | 'playlist' | 'category';
  item: AudioTrack | Playlist;
  reason: string;
  confidence: number; // 0-1
  context: {
    time?: 'morning' | 'afternoon' | 'evening' | 'night';
    mood?: string;
    activity?: string;
    weather?: string;
    location?: string;
  };
  createdAt: Date;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  context?: Record<string, any>;
}

// Feature Flag Types
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  conditions?: {
    userSegments?: string[];
    platforms?: ('ios' | 'android')[];
    appVersions?: string[];
    countries?: string[];
  };
  metadata?: Record<string, any>;
}

// Content Types
export interface ContentItem {
  id: string;
  type: 'audiobook' | 'podcast' | 'music' | 'meditation' | 'sleep-story';
  title: string;
  description: string;
  creator: string;
  category: string;
  tags: string[];
  duration: number;
  rating: number;
  ratingCount: number;
  playCount: number;
  favoriteCount: number;
  downloadCount: number;
  isPremium: boolean;
  isExclusive: boolean;
  releaseDate: Date;
  lastUpdated: Date;
  availability: {
    regions: string[];
    startDate?: Date;
    endDate?: Date;
  };
  content: {
    audioUrl: string;
    previewUrl?: string;
    transcriptUrl?: string;
    coverImageUrl?: string;
    backgroundImageUrl?: string;
  };
  metadata: {
    language: string;
    narrator?: string;
    author?: string;
    publisher?: string;
    isbn?: string;
    copyright?: string;
    licenses?: string[];
  };
}

// Notification Types
export interface AppNotification {
  id: string;
  userId: string;
  type: 'system' | 'content' | 'social' | 'promotion';
  title: string;
  body: string;
  imageUrl?: string;
  actionUrl?: string;
  actionType?: 'deep-link' | 'web-link' | 'in-app';
  isRead: boolean;
  isPriority: boolean;
  expiresAt?: Date;
  createdAt: Date;
  scheduledFor?: Date;
  metadata?: Record<string, any>;
}