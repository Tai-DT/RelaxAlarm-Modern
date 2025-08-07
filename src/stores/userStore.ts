/**
 * Basic User Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  isPremium: boolean;
  preferences: {
    favoriteGenres: string[];
    sleepGoal: number;
    wakeUpTime: string;
    bedTime: string;
    enableSmartAlarms: boolean;
    preferredNarrators: string[];
    autoDownload: boolean;
    dataUsageLimit: number;
  };
  stats: {
    totalListeningTime: number;
    sleepSessions: number;
    meditationSessions: number;
    currentStreak: number;
    longestStreak: number;
    favoriteContent: string[];
    weeklyProgress: number[];
  };
  createdAt: Date;
  lastLoginAt: Date;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  initializeUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()()
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      
      login: async (user: User) => {
        set({ isLoading: true, error: null });
        try {
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: 'Login failed', isLoading: false });
        }
      },
      
      logout: async () => {
        set({ user: null, isLoading: false, error: null });
      },
      
      updateUser: async (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
      
      initializeUser: async () => {
        // Initialize with existing persisted user if available
        const { user } = get();
        if (user) {
          set({ user });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  ),
);