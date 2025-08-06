/**
 * Advanced Player Store with Queue Management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioContent, PlaybackState, RepeatMode } from '../types';

export interface PlayerStore {
  // Current playback state
  currentContent: AudioContent | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  playbackRate: number;
  
  // Queue management
  queue: AudioContent[];
  currentIndex: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  
  // Sleep timer
  sleepTimer: number | null;
  sleepTimerRemaining: number | null;
  
  // Player state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  playContent: (content: AudioContent) => void;
  pauseContent: () => void;
  resumeContent: () => void;
  stopContent: () => void;
  seekTo: (position: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  
  // Queue actions
  addToQueue: (content: AudioContent) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  shuffleQueue: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  
  // Sleep timer
  setSleepTimer: (minutes: number) => void;
  clearSleepTimer: () => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const usePlayerStore = create<PlayerStore>()(n  persist(
    (set, get) => ({
      // Initial state
      currentContent: null,
      isPlaying: false,
      position: 0,
      duration: 0,
      volume: 1.0,
      playbackRate: 1.0,
      
      queue: [],
      currentIndex: -1,
      shuffle: false,
      repeatMode: 'off',
      
      sleepTimer: null,
      sleepTimerRemaining: null,
      
      isLoading: false,
      error: null,
      
      // Playback actions
      playContent: (content) => {
        const { queue, shuffle } = get();
        let newQueue = [...queue];
        
        // Add to queue if not already present
        const existingIndex = newQueue.findIndex(item => item.id === content.id);
        if (existingIndex === -1) {
          newQueue.push(content);
        }
        
        const currentIndex = existingIndex !== -1 ? existingIndex : newQueue.length - 1;
        
        if (shuffle) {
          // Shuffle queue but keep current item at the beginning
          const currentItem = newQueue[currentIndex];
          const otherItems = newQueue.filter((_, index) => index !== currentIndex);
          newQueue = [currentItem, ...otherItems.sort(() => Math.random() - 0.5)];
        }
        
        set({
          currentContent: content,
          isPlaying: true,
          queue: newQueue,
          currentIndex: 0,
          position: 0,
          isLoading: true,
          error: null,
        });
      },
      
      pauseContent: () => {
        set({ isPlaying: false });
      },
      
      resumeContent: () => {
        set({ isPlaying: true });
      },
      
      stopContent: () => {
        set({
          isPlaying: false,
          position: 0,
          currentContent: null,
        });
      },
      
      seekTo: (position) => {
        set({ position });
      },
      
      setVolume: (volume) => {
        set({ volume: Math.max(0, Math.min(1, volume)) });
      },
      
      setPlaybackRate: (rate) => {
        set({ playbackRate: Math.max(0.5, Math.min(2.0, rate)) });
      },
      
      // Queue management
      addToQueue: (content) => {
        const { queue } = get();
        const existingIndex = queue.findIndex(item => item.id === content.id);
        
        if (existingIndex === -1) {
          set({ queue: [...queue, content] });
        }
      },
      
      removeFromQueue: (index) => {
        const { queue, currentIndex } = get();
        const newQueue = queue.filter((_, i) => i !== index);
        
        let newCurrentIndex = currentIndex;
        if (index < currentIndex) {
          newCurrentIndex = currentIndex - 1;
        } else if (index === currentIndex && newQueue.length > 0) {
          newCurrentIndex = Math.min(currentIndex, newQueue.length - 1);
        }
        
        set({
          queue: newQueue,
          currentIndex: newCurrentIndex,
          currentContent: newQueue[newCurrentIndex] || null,
        });
      },
      
      clearQueue: () => {
        set({
          queue: [],
          currentIndex: -1,
          currentContent: null,
          isPlaying: false,
        });
      },
      
      playNext: () => {
        const { queue, currentIndex, repeatMode } = get();
        
        if (queue.length === 0) return;
        
        let nextIndex = currentIndex + 1;
        
        if (nextIndex >= queue.length) {
          if (repeatMode === 'all') {
            nextIndex = 0;
          } else {
            // End of queue
            set({ isPlaying: false });
            return;
          }
        }
        
        const nextContent = queue[nextIndex];
        if (nextContent) {
          set({
            currentContent: nextContent,
            currentIndex: nextIndex,
            position: 0,
            isPlaying: true,
          });
        }
      },
      
      playPrevious: () => {
        const { queue, currentIndex, position } = get();
        
        if (queue.length === 0) return;
        
        // If more than 3 seconds into the track, restart current track
        if (position > 3) {
          set({ position: 0 });
          return;
        }
        
        let prevIndex = currentIndex - 1;
        
        if (prevIndex < 0) {
          prevIndex = queue.length - 1;
        }
        
        const prevContent = queue[prevIndex];
        if (prevContent) {
          set({
            currentContent: prevContent,
            currentIndex: prevIndex,
            position: 0,
            isPlaying: true,
          });
        }
      },
      
      shuffleQueue: () => {
        const { queue, currentContent, shuffle } = get();
        
        if (queue.length <= 1) return;
        
        if (!shuffle) {
          // Enable shuffle
          const currentItem = currentContent;
          const otherItems = queue.filter(item => item.id !== currentItem?.id);
          const shuffledOthers = otherItems.sort(() => Math.random() - 0.5);
          const newQueue = currentItem ? [currentItem, ...shuffledOthers] : shuffledOthers;
          
          set({
            queue: newQueue,
            shuffle: true,
            currentIndex: 0,
          });
        } else {
          // Disable shuffle - restore original order
          set({ shuffle: false });
        }
      },
      
      setRepeatMode: (mode) => {
        set({ repeatMode: mode });
      },
      
      // Sleep timer
      setSleepTimer: (minutes) => {
        const timeInMs = minutes * 60 * 1000;
        set({
          sleepTimer: Date.now() + timeInMs,
          sleepTimerRemaining: timeInMs,
        });
        
        // Start countdown
        const interval = setInterval(() => {
          const { sleepTimer } = get();
          if (!sleepTimer) {
            clearInterval(interval);
            return;
          }
          
          const remaining = sleepTimer - Date.now();
          
          if (remaining <= 0) {
            clearInterval(interval);
            get().pauseContent();
            set({
              sleepTimer: null,
              sleepTimerRemaining: null,
            });
          } else {
            set({ sleepTimerRemaining: remaining });
          }
        }, 1000);
      },
      
      clearSleepTimer: () => {
        set({
          sleepTimer: null,
          sleepTimerRemaining: null,
        });
      },
      
      // Error handling
      setError: (error) => {
        set({ error, isLoading: false });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'player-store',
      storage: {
        getItem: (name) => AsyncStorage.getItem(name),
        setItem: (name, value) => AsyncStorage.setItem(name, value),
        removeItem: (name) => AsyncStorage.removeItem(name),
      },
      partialize: (state) => ({
        volume: state.volume,
        playbackRate: state.playbackRate,
        shuffle: state.shuffle,
        repeatMode: state.repeatMode,
        queue: state.queue,
      }),
    }
  )
);