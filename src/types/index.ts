/**
 * Complete Type Definitions for RelaxAlarm Modern
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// =============================================================================
// Navigation Types
// =============================================================================

export type RootStackParamList = {
  // Auth Stack
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  
  // Main App
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  
  // Modal Screens
  PodcastPlayer: { podcast: Podcast };
  AudioPlayer: { content: AudioContent };
  AlarmSettings: { alarmId?: string };
  Settings: undefined;
  Profile: undefined;
  Premium: undefined;
  
  // Content Screens
  PodcastDetails: { podcastId: string };
  PlaylistDetails: { playlistId: string };
  CategoryBrowser: { category: string };
};

export type MainTabParamList = {
  Home: undefined;
  Audiobooks: undefined;
  Podcasts: undefined;
  Alarms: undefined;
  Profile: undefined;
};

// =============================================================================
// User & Authentication Types
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  isPremium: boolean;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserPreferences {
  favoriteGenres: string[];
  sleepGoal: number; // hours
  wakeUpTime: string;
  bedTime: string;
  enableSmartAlarms: boolean;
  preferredNarrators: string[];
  autoDownload: boolean;
  dataUsageLimit: number; // MB
}

export interface UserStats {
  totalListeningTime: number; // minutes
  sleepSessions: number;
  meditationSessions: number;
  currentStreak: number; // days
  longestStreak: number; // days
  favoriteContent: AudioContent[];
  weeklyProgress: WeeklyProgress[];
}

export interface WeeklyProgress {
  week: string; // ISO week
  listeningTime: number;
  sleepQuality: number; // 1-10
  sessions: number;
}

// =============================================================================
// Audio Content Types
// =============================================================================

export interface AudioContent {
  id: string;
  title: string;
  author: string;
  description: string;
  duration: number; // seconds
  url: string;
  coverImage: string;
  category: ContentCategory;
  tags: string[];
  
  // Metadata
  rating: number;
  reviewCount: number;
  releaseDate: string;
  language: string;
  isSubscriptionRequired: boolean;
  downloadSize?: number; // bytes
  
  // Progress tracking
  isCompleted: boolean;
  currentPosition?: number; // seconds
  lastPlayedAt?: Date;
  
  // Related content
  relatedContent?: string[]; // content IDs
  nextInSeries?: string; // content ID
  
  // AI/LLM specific (for podcasts)
  transcript?: string;
  chapters?: Chapter[];
}

export interface Podcast extends AudioContent {
  episodeCount: number;
  episodes: Episode[];
  subscriptionInfo?: SubscriptionInfo;
  updateFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  duration: number;
  url: string;
  publishDate: string;
  episodeNumber: number;
  seasonNumber?: number;
}

export interface Chapter {
  id: string;
  title: string;
  startTime: number; // seconds
  endTime: number; // seconds
  description?: string;
}

export interface SubscriptionInfo {
  cost: number;
  currency: string;
  period: 'monthly' | 'yearly';
  features: string[];
}

export type ContentCategory = 
  | 'sleep'
  | 'meditation'
  | 'nature'
  | 'stories'
  | 'music'
  | 'mindfulness'
  | 'healing'
  | 'focus'
  | 'anxiety'
  | 'children';

// =============================================================================
// Alarm Types
// =============================================================================

export interface Alarm {
  id: string;
  label: string;
  time: Date;
  isActive: boolean;
  repeatDays?: number[]; // 0-6, Sunday = 0
  
  // Sound settings
  soundUri?: string;
  volume: number;
  vibrate: boolean;
  
  // Smart features
  isSmartAlarm: boolean;
  smartWindow: number; // minutes before alarm time
  gradualWakeUp: boolean;
  
  // Snooze settings
  snoozeEnabled: boolean;
  snoozeDuration: number; // minutes
  maxSnoozes: number;
  
  // Weather integration
  weatherAdjustment: boolean;
  
  // Metadata
  createdAt: Date;
  lastTriggered?: Date;
  timesTriggered: number;
}

export interface SleepCycle {
  sleepTime: Date;
  wakeTime: Date;
  stages: SleepStage[];
  quality: number; // 1-10
  efficiency: number; // percentage
}

export interface SleepStage {
  stage: 'light' | 'deep' | 'rem' | 'awake';
  startTime: Date;
  duration: number; // minutes
}

// =============================================================================
// Playback Types
// =============================================================================

export type PlaybackState = 
  | 'loading'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'buffering'
  | 'error';

export type RepeatMode = 'off' | 'one' | 'all';

export interface PlaybackSession {
  id: string;
  contentId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds actually played
  completed: boolean;
  deviceInfo: DeviceInfo;
}

export interface DeviceInfo {
  platform: 'ios' | 'android';
  version: string;
  model: string;
  isTablet: boolean;
}

// =============================================================================
// Playlist Types
// =============================================================================

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  createdBy: string; // user ID
  contentIds: string[];
  tags: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  totalDuration: number; // seconds
  playCount: number;
  likeCount: number;
}

// =============================================================================
// Download & Offline Types
// =============================================================================

export interface DownloadItem {
  contentId: string;
  status: DownloadStatus;
  progress: number; // 0-100
  filePath?: string;
  size: number; // bytes
  downloadedAt?: Date;
  expiresAt?: Date;
}

export type DownloadStatus = 
  | 'pending'
  | 'downloading'
  | 'completed'
  | 'failed'
  | 'paused';

// =============================================================================
// Analytics & Tracking Types
// =============================================================================

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  properties: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

export type EventType = 
  | 'content_play'
  | 'content_pause'
  | 'content_complete'
  | 'alarm_trigger'
  | 'alarm_snooze'
  | 'download_start'
  | 'download_complete'
  | 'premium_upgrade'
  | 'settings_change'
  | 'sleep_session_start'
  | 'sleep_session_end';

// =============================================================================
// Notification Types
// =============================================================================

export interface NotificationSettings {
  enabled: boolean;
  types: NotificationType[];
  quietHours: QuietHours;
  frequency: NotificationFrequency;
}

export type NotificationType = 
  | 'alarm'
  | 'reminder'
  | 'content_recommendation'
  | 'sleep_tip'
  | 'milestone'
  | 'social';

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export type NotificationFrequency = 'immediate' | 'hourly' | 'daily' | 'weekly';

// =============================================================================
// Theme & UI Types
// =============================================================================

export interface ThemeColors {
  // Primary colors
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  
  // Secondary colors
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  
  // Tertiary colors
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  
  // Error colors
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  
  // Surface colors
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  
  // Background
  background: string;
  onBackground: string;
  
  // Outline
  outline: string;
  outlineVariant: string;
  
  // Other
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

export interface AppTheme {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  elevation: Elevation;
}

export interface Typography {
  displayLarge: TextStyle;
  displayMedium: TextStyle;
  displaySmall: TextStyle;
  headlineLarge: TextStyle;
  headlineMedium: TextStyle;
  headlineSmall: TextStyle;
  titleLarge: TextStyle;
  titleMedium: TextStyle;
  titleSmall: TextStyle;
  bodyLarge: TextStyle;
  bodyMedium: TextStyle;
  bodySmall: TextStyle;
  labelLarge: TextStyle;
  labelMedium: TextStyle;
  labelSmall: TextStyle;
}

export interface TextStyle {
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing?: number;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface Elevation {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

// =============================================================================
// API & Network Types
// =============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// =============================================================================
// Utility Types
// =============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// =============================================================================
// Component Props Types
// =============================================================================

export interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  onPress?: () => void;
  style?: any;
  children?: React.ReactNode;
}

export interface CardProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: any;
  children?: React.ReactNode;
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightIcon?: string;
  leftIcon?: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  onLeftPress?: () => void;
  style?: any;
}

// =============================================================================
// State Management Types
// =============================================================================

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark' | 'auto';
  currentContent: AudioContent | null;
  playbackState: PlaybackState;
  downloads: DownloadItem[];
  alarms: Alarm[];
  playlists: Playlist[];
  settings: AppSettings;
}

export interface AppSettings {
  // Audio settings
  audioQuality: 'low' | 'medium' | 'high' | 'lossless';
  autoPlay: boolean;
  downloadOverWifiOnly: boolean;
  
  // Privacy settings
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
  
  // Accessibility
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reduceMotion: boolean;
  
  // Notifications
  notifications: NotificationSettings;
}