/**
 * Advanced Settings Store with Categories
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsStore {
  // Audio settings
  audioQuality: 'standard' | 'high' | 'lossless';
  autoPlay: boolean;
  crossfadeDuration: number;
  offlineMode: boolean;
  
  // Sleep settings
  sleepTimerDefault: number;
  fadeOutDuration: number;
  bedtimeReminders: boolean;
  doNotDisturb: boolean;
  
  // Notification settings
  pushNotifications: boolean;
  meditationReminders: boolean;
  weeklyReports: boolean;
  soundOnNotifications: boolean;
  
  // Appearance settings
  themeMode: 'light' | 'dark' | 'auto';
  accentColor: 'forest' | 'ocean' | 'sunset' | 'lavender';
  animations: boolean;
  reduceMotion: boolean;
  
  // Privacy settings
  analytics: boolean;
  crashReports: boolean;
  personalizedAds: boolean;
  dataSaver: boolean;
  
  // Actions
  updateSetting: <K extends keyof SettingsStore>(key: K, value: SettingsStore[K]) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

const defaultSettings = {
  // Audio
  audioQuality: 'high' as const,
  autoPlay: true,
  crossfadeDuration: 3,
  offlineMode: false,
  
  // Sleep
  sleepTimerDefault: 45,
  fadeOutDuration: 30,
  bedtimeReminders: true,
  doNotDisturb: true,
  
  // Notifications
  pushNotifications: true,
  meditationReminders: false,
  weeklyReports: true,
  soundOnNotifications: false,
  
  // Appearance
  themeMode: 'auto' as const,
  accentColor: 'forest' as const,
  animations: true,
  reduceMotion: false,
  
  // Privacy
  analytics: true,
  crashReports: true,
  personalizedAds: false,
  dataSaver: false,
};

export const useSettingsStore = create<SettingsStore>()(n  persist(
    (set, get) => ({
      ...defaultSettings,
      
      updateSetting: (key, value) => {
        set({ [key]: value });
      },
      
      resetSettings: () => {
        set(defaultSettings);
      },
      
      exportSettings: () => {
        const settings = get();
        const exportData = {
          ...settings,
          exportDate: new Date().toISOString(),
          version: '1.0.0',
        };
        return JSON.stringify(exportData, null, 2);
      },
      
      importSettings: (settingsJson) => {
        try {
          const importedSettings = JSON.parse(settingsJson);
          
          // Validate settings structure
          const validKeys = Object.keys(defaultSettings);
          const filteredSettings: Partial<SettingsStore> = {};
          
          for (const key of validKeys) {
            if (key in importedSettings) {
              filteredSettings[key as keyof SettingsStore] = importedSettings[key];
            }
          }
          
          set({ ...defaultSettings, ...filteredSettings });
          return true;
        } catch (error) {
          console.error('Failed to import settings:', error);
          return false;
        }
      },
    }),
    {
      name: 'settings-store',
      storage: {
        getItem: (name) => AsyncStorage.getItem(name),
        setItem: (name, value) => AsyncStorage.setItem(name, value),
        removeItem: (name) => AsyncStorage.removeItem(name),
      },
    }
  )
);