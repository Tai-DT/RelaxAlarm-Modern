/**
 * Settings Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  // Audio Settings
  audioQuality: 'low' | 'medium' | 'high';
  autoPlay: boolean;
  crossfade: boolean;
  volumeBoost: boolean;
  
  // Sleep Settings
  sleepTimer: number;
  fadeOutDuration: number;
  wakeUpGradually: boolean;
  smartAlarmWindow: number;
  
  // Notification Settings
  enableNotifications: boolean;
  enablePushNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  
  // Appearance Settings
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  
  // Privacy Settings
  analytics: boolean;
  crashReporting: boolean;
  personalizedAds: boolean;
  
  // Actions
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

const defaultSettings: Omit<SettingsState, 'updateSettings' | 'resetSettings'> = {
  // Audio Settings
  audioQuality: 'high',
  autoPlay: true,
  crossfade: false,
  volumeBoost: false,
  
  // Sleep Settings
  sleepTimer: 30,
  fadeOutDuration: 5,
  wakeUpGradually: true,
  smartAlarmWindow: 30,
  
  // Notification Settings
  enableNotifications: true,
  enablePushNotifications: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '07:00',
  },
  
  // Appearance Settings
  fontSize: 'medium',
  reducedMotion: false,
  
  // Privacy Settings
  analytics: true,
  crashReporting: true,
  personalizedAds: false,
};

export const useSettingsStore = create<SettingsState>()()
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      updateSettings: (updates) => {
        set((state) => ({ ...state, ...updates }));
      },
      
      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'settings-storage',
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