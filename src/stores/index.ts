/**
 * Modern Zustand Store for RelaxAlarm
 * Centralized state management with TypeScript
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  AuthState, 
  PlayerState, 
  AudioContent, 
  SleepSession, 
  Alarm,
  UserPreferences 
} from '../types';

// Auth Store
interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: '1',
            email,
            name: 'Demo User',
            isPremium: false,
            preferences: {
              theme: 'system',
              notificationsEnabled: true,
              soundEnabled: true,
              sleepGoal: 8,
              wakeUpTime: '07:00',
              bedTime: '23:00',
              language: 'en',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Invalid credentials', 
            isLoading: false 
          });
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: '1',
            email,
            name,
            isPremium: false,
            preferences: {
              theme: 'system',
              notificationsEnabled: true,
              soundEnabled: true,
              sleepGoal: 8,
              wakeUpTime: '07:00',
              bedTime: '23:00',
              language: 'en',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Registration failed', 
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              ...userData, 
              updatedAt: new Date() 
            } 
          });
        }
      },

      updatePreferences: (preferences: Partial<UserPreferences>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              preferences: { 
                ...user.preferences, 
                ...preferences 
              },
              updatedAt: new Date() 
            } 
          });
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Player Store
interface PlayerStore extends PlayerState {
  play: (content: AudioContent) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (position: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlaylist: (playlist: AudioContent[]) => void;
  addToPlaylist: (content: AudioContent) => void;
  removeFromPlaylist: (contentId: string) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentContent: null,
      isPlaying: false,
      isLoading: false,
      position: 0,
      duration: 0,
      playbackRate: 1,
      volume: 1,
      repeatMode: 'off',
      shuffleEnabled: false,
      playlist: [],
      currentIndex: 0,

      play: (content: AudioContent) => {
        set({ 
          currentContent: content, 
          isPlaying: true, 
          isLoading: true,
          position: 0 
        });
      },

      pause: () => {
        set({ isPlaying: false });
      },

      resume: () => {
        set({ isPlaying: true });
      },

      stop: () => {
        set({ 
          isPlaying: false, 
          position: 0 
        });
      },

      seek: (position: number) => {
        set({ position });
      },

      setPlaybackRate: (rate: number) => {
        set({ playbackRate: rate });
      },

      setVolume: (volume: number) => {
        set({ volume });
      },

      toggleRepeat: () => {
        const { repeatMode } = get();
        const modes: Array<typeof repeatMode> = ['off', 'one', 'all'];
        const currentIndex = modes.indexOf(repeatMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        set({ repeatMode: nextMode });
      },

      toggleShuffle: () => {
        set((state) => ({ shuffleEnabled: !state.shuffleEnabled }));
      },

      playNext: () => {
        const { playlist, currentIndex, shuffleEnabled } = get();
        if (playlist.length === 0) return;
        
        let nextIndex = currentIndex + 1;
        if (shuffleEnabled) {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } else if (nextIndex >= playlist.length) {
          nextIndex = 0;
        }
        
        const nextContent = playlist[nextIndex];
        set({ 
          currentContent: nextContent, 
          currentIndex: nextIndex,
          position: 0
        });
      },

      playPrevious: () => {
        const { playlist, currentIndex } = get();
        if (playlist.length === 0) return;
        
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = playlist.length - 1;
        }
        
        const prevContent = playlist[prevIndex];
        set({ 
          currentContent: prevContent, 
          currentIndex: prevIndex,
          position: 0
        });
      },

      setPlaylist: (playlist: AudioContent[]) => {
        set({ playlist, currentIndex: 0 });
      },

      addToPlaylist: (content: AudioContent) => {
        set((state) => ({ 
          playlist: [...state.playlist, content] 
        }));
      },

      removeFromPlaylist: (contentId: string) => {
        set((state) => ({
          playlist: state.playlist.filter(item => item.id !== contentId)
        }));
      },
    }),
    {
      name: 'player-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        volume: state.volume,
        playbackRate: state.playbackRate,
        repeatMode: state.repeatMode,
        shuffleEnabled: state.shuffleEnabled,
      }),
    }
  )
);

// Theme Store
interface ThemeStore {
  theme: 'light' | 'dark' | 'system';
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,

      setTheme: (theme: 'light' | 'dark' | 'system') => {
        const isDark = theme === 'dark' || 
          (theme === 'system' && new Date().getHours() >= 18);
        set({ theme, isDark });
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Sleep Store
interface SleepStore {
  sessions: SleepSession[];
  currentSession: SleepSession | null;
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: (quality?: 1 | 2 | 3 | 4 | 5, notes?: string) => void;
  addSession: (session: SleepSession) => void;
  updateSession: (id: string, session: Partial<SleepSession>) => void;
  deleteSession: (id: string) => void;
  getSleepStats: () => any;
}

export const useSleepStore = create<SleepStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      isTracking: false,

      startTracking: () => {
        const newSession: SleepSession = {
          id: Date.now().toString(),
          userId: '1', // Get from auth store
          startTime: new Date(),
          endTime: new Date(),
          duration: 0,
          quality: 3,
          createdAt: new Date(),
        };
        
        set({ 
          currentSession: newSession, 
          isTracking: true 
        });
      },

      stopTracking: (quality = 3, notes) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        const endTime = new Date();
        const duration = Math.floor(
          (endTime.getTime() - currentSession.startTime.getTime()) / (1000 * 60)
        );
        
        const completedSession: SleepSession = {
          ...currentSession,
          endTime,
          duration,
          quality,
          notes,
        };
        
        set((state) => ({
          sessions: [...state.sessions, completedSession],
          currentSession: null,
          isTracking: false,
        }));
      },

      addSession: (session: SleepSession) => {
        set((state) => ({
          sessions: [...state.sessions, session],
        }));
      },

      updateSession: (id: string, sessionUpdate: Partial<SleepSession>) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === id 
              ? { ...session, ...sessionUpdate }
              : session
          ),
        }));
      },

      deleteSession: (id: string) => {
        set((state) => ({
          sessions: state.sessions.filter(session => session.id !== id),
        }));
      },

      getSleepStats: () => {
        const { sessions } = get();
        // Calculate stats
        return {
          averageDuration: sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length || 0,
          averageQuality: sessions.reduce((acc, s) => acc + s.quality, 0) / sessions.length || 0,
          totalSessions: sessions.length,
          streak: 0, // Calculate streak logic
        };
      },
    }),
    {
      name: 'sleep-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Alarms Store
interface AlarmsStore {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
}

export const useAlarmsStore = create<AlarmsStore>()(
  persist(
    (set, get) => ({
      alarms: [],

      addAlarm: (alarmData) => {
        const newAlarm: Alarm = {
          ...alarmData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          alarms: [...state.alarms, newAlarm],
        }));
      },

      updateAlarm: (id: string, alarmUpdate: Partial<Alarm>) => {
        set((state) => ({
          alarms: state.alarms.map(alarm =>
            alarm.id === id 
              ? { ...alarm, ...alarmUpdate, updatedAt: new Date() }
              : alarm
          ),
        }));
      },

      deleteAlarm: (id: string) => {
        set((state) => ({
          alarms: state.alarms.filter(alarm => alarm.id !== id),
        }));
      },

      toggleAlarm: (id: string) => {
        set((state) => ({
          alarms: state.alarms.map(alarm =>
            alarm.id === id 
              ? { ...alarm, isEnabled: !alarm.isEnabled, updatedAt: new Date() }
              : alarm
          ),
        }));
      },
    }),
    {
      name: 'alarms-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);