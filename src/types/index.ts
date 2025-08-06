/**
 * TypeScript Type Definitions for RelaxAlarm Modern
 */

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  sleepGoal: number; // hours
  wakeUpTime: string; // HH:mm format
  bedTime: string; // HH:mm format
  language: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // days
  features: string[];
  popular?: boolean;
  trial?: boolean;
}

export interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentPlan: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
}

// Content Types
export interface AudioContent {
  id: string;
  title: string;
  description: string;
  author: string;
  duration: number; // seconds
  url: string;
  thumbnailUrl: string;
  category: ContentCategory;
  tags: string[];
  isPremium: boolean;
  isDownloaded: boolean;
  downloadUrl?: string;
  playCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Audiobook extends AudioContent {
  type: 'audiobook';
  chapters: Chapter[];
  narrator: string;
  language: string;
  genre: string;
}

export interface Podcast extends AudioContent {
  type: 'podcast';
  episodes: Episode[];
  publisher: string;
  rssUrl?: string;
  website?: string;
}

export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  publishedAt: Date;
  seasonNumber?: number;
  episodeNumber?: number;
}

export type ContentCategory = 
  | 'sleep-stories'
  | 'meditation'
  | 'nature-sounds'
  | 'music'
  | 'podcasts'
  | 'audiobooks'
  | 'white-noise'
  | 'guided-sleep'
  | 'relaxation';

// Player Types
export interface PlayerState {
  currentContent: AudioContent | null;
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  playbackRate: number;
  volume: number;
  repeatMode: 'off' | 'one' | 'all';
  shuffleEnabled: boolean;
  playlist: AudioContent[];
  currentIndex: number;
}

export interface PlaybackHistory {
  id: string;
  contentId: string;
  userId: string;
  position: number;
  duration: number;
  completedAt?: Date;
  playedAt: Date;
}

// Sleep Tracking Types
export interface SleepSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  createdAt: Date;
}

export interface SleepStats {
  averageDuration: number;
  averageQuality: number;
  totalSessions: number;
  streak: number;
  weeklyData: SleepWeekData[];
  monthlyData: SleepMonthData[];
}

export interface SleepWeekData {
  week: string; // YYYY-WW format
  averageDuration: number;
  averageQuality: number;
  sessions: number;
}

export interface SleepMonthData {
  month: string; // YYYY-MM format
  averageDuration: number;
  averageQuality: number;
  sessions: number;
}

// Alarm Types
export interface Alarm {
  id: string;
  userId: string;
  time: string; // HH:mm format
  label: string;
  isEnabled: boolean;
  repeatDays: boolean[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  soundId: string;
  vibrationEnabled: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface AlarmSound {
  id: string;
  name: string;
  url: string;
  category: 'gentle' | 'nature' | 'music' | 'traditional';
  duration: number;
  isPremium: boolean;
}

// Navigation Types
export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Register: undefined;
  Subscription: { planId?: string };
  AudiobookPlayer: { audiobook: Audiobook };
  PodcastPlayer: { podcast: Podcast; episode?: Episode };
  AlarmSettings: { alarmId?: string };
  UserProfile: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Audiobooks: undefined;
  Podcasts: undefined;
  Sleep: undefined;
  Alarms: undefined;
  Profile: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Store Types
export interface AppState {
  auth: AuthState;
  subscription: SubscriptionState;
  player: PlayerState;
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
}

// Component Props Types
export interface BaseComponentProps {
  testID?: string;
  style?: any;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export interface CardProps extends BaseComponentProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  padding?: keyof typeof import('../constants/theme').spacing;
  margin?: keyof typeof import('../constants/theme').spacing;
  onPress?: () => void;
  disabled?: boolean;
}

// Error Types
export class AppError extends Error {
  code: string;
  statusCode?: number;
  
  constructor(message: string, code: string, statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export interface ErrorInfo {
  message: string;
  code: string;
  stack?: string;
  timestamp: Date;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Form Types
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface LoginForm {
  email: FormField;
  password: FormField;
}

export interface RegisterForm {
  name: FormField;
  email: FormField;
  password: FormField;
  confirmPassword: FormField;
  acceptTerms: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}

export interface FormValidation {
  [key: string]: ValidationRule;
}