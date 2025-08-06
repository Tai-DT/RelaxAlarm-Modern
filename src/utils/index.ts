/**
 * Advanced Utility Functions for RelaxAlarm
 */

import { AudioContent, Alarm, SleepCycle, User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

// =============================================================================
// Time & Date Utilities
// =============================================================================

export const timeUtils = {
  /**
   * Format duration in seconds to human readable format
   */
  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },
  
  /**
   * Format time for display (e.g., "2:30 PM")
   */
  formatTime: (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  },
  
  /**
   * Calculate time until next alarm
   */
  getTimeUntilAlarm: (alarmTime: Date): string => {
    const now = new Date();
    let targetTime = new Date(alarmTime);
    
    // If alarm time is in the past, assume it's for tomorrow
    if (targetTime.getTime() <= now.getTime()) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const diff = targetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  },
  
  /**
   * Get sleep cycle analysis
   */
  analyzeSleepCycle: (sleepTime: Date, wakeTime: Date): SleepCycle => {
    const totalSleep = wakeTime.getTime() - sleepTime.getTime();
    const sleepHours = totalSleep / (1000 * 60 * 60);
    
    // Simple sleep stage estimation
    const stages = [];
    let currentTime = new Date(sleepTime);
    
    // Light sleep (first 30 min)
    stages.push({
      stage: 'light' as const,
      startTime: new Date(currentTime),
      duration: 30,
    });
    
    // Cycles of deep -> rem sleep
    const cycleCount = Math.floor(sleepHours / 1.5);
    for (let i = 0; i < cycleCount; i++) {
      currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
      
      // Deep sleep (45 min)
      stages.push({
        stage: 'deep' as const,
        startTime: new Date(currentTime),
        duration: 45,
      });
      
      currentTime = new Date(currentTime.getTime() + 45 * 60 * 1000);
      
      // REM sleep (30 min)
      stages.push({
        stage: 'rem' as const,
        startTime: new Date(currentTime),
        duration: 30,
      });
    }
    
    const quality = Math.min(10, Math.max(1, sleepHours * 1.2));
    const efficiency = Math.min(100, (sleepHours / 8) * 100);
    
    return {
      sleepTime,
      wakeTime,
      stages,
      quality,
      efficiency,
    };
  },
};

// =============================================================================
// Audio & Media Utilities
// =============================================================================

export const audioUtils = {
  /**
   * Get audio file duration
   */
  getAudioDuration: async (uri: string): Promise<number> => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      const status = await sound.getStatusAsync();
      await sound.unloadAsync();
      
      if (status.isLoaded) {
        return (status.durationMillis || 0) / 1000;
      }
      return 0;
    } catch (error) {
      console.error('Failed to get audio duration:', error);
      return 0;
    }
  },
  
  /**
   * Validate audio URL
   */
  isValidAudioUrl: (url: string): boolean => {
    const audioFormats = ['.mp3', '.wav', '.aac', '.m4a', '.ogg'];
    return audioFormats.some(format => url.toLowerCase().includes(format));
  },
  
  /**
   * Generate audio waveform data
   */
  generateWaveform: (audioUrl: string): Promise<number[]> => {
    // Simplified waveform generation
    return new Promise(resolve => {
      const waveform = Array.from({ length: 100 }, () => Math.random() * 100);
      resolve(waveform);
    });
  },
  
  /**
   * Calculate optimal sleep timer duration
   */
  calculateOptimalSleepTimer: (contentDuration: number, currentTime: Date): number => {
    const hour = currentTime.getHours();
    
    // Evening: longer timer
    if (hour >= 20 || hour <= 6) {
      return Math.min(contentDuration, 60 * 60); // Max 1 hour
    }
    
    // Daytime: shorter timer
    return Math.min(contentDuration, 30 * 60); // Max 30 minutes
  },
};

// =============================================================================
// Storage & Cache Utilities
// =============================================================================

export const storageUtils = {
  /**
   * Get storage usage statistics
   */
  getStorageStats: async (): Promise<{
    totalSize: number;
    availableSize: number;
    audioFiles: number;
  }> => {
    try {
      const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory!);
      const audioDir = FileSystem.documentDirectory + 'downloads/';
      
      let audioFiles = 0;
      let totalSize = 0;
      
      try {
        const files = await FileSystem.readDirectoryAsync(audioDir);
        audioFiles = files.filter(f => f.endsWith('.mp3')).length;
        
        for (const file of files) {
          const fileInfo = await FileSystem.getInfoAsync(audioDir + file);
          if (fileInfo.exists) {
            totalSize += fileInfo.size || 0;
          }
        }
      } catch {
        // Directory doesn't exist yet
      }
      
      return {
        totalSize,
        availableSize: 1000000000, // 1GB mock value
        audioFiles,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { totalSize: 0, availableSize: 0, audioFiles: 0 };
    }
  },
  
  /**
   * Clear app cache
   */
  clearCache: async (): Promise<void> => {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (cacheDir) {
        await FileSystem.deleteAsync(cacheDir, { idempotent: true });
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  },
  
  /**
   * Export user data
   */
  exportUserData: async (user: User): Promise<string> => {
    const exportData = {
      user,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    
    return JSON.stringify(exportData, null, 2);
  },
  
  /**
   * Backup app data to storage
   */
  backupData: async (): Promise<boolean> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);
      
      const backup = {
        timestamp: new Date().toISOString(),
        data: Object.fromEntries(data),
      };
      
      const backupPath = FileSystem.documentDirectory + 'backup.json';
      await FileSystem.writeAsStringAsync(backupPath, JSON.stringify(backup));
      
      return true;
    } catch (error) {
      console.error('Failed to backup data:', error);
      return false;
    }
  },
};

// =============================================================================
// Validation Utilities
// =============================================================================

export const validationUtils = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  /**
   * Validate password strength
   */
  validatePassword: (password: string): {
    isValid: boolean;
    issues: string[];
  } => {
    const issues: string[] = [];
    
    if (password.length < 8) {
      issues.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      issues.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      issues.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      issues.push('Password must contain at least one number');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
    };
  },
  
  /**
   * Validate alarm time
   */
  isValidAlarmTime: (time: Date): boolean => {
    const now = new Date();
    const timeDiff = time.getTime() - now.getTime();
    
    // Alarm must be at least 1 minute in the future
    return timeDiff > 60 * 1000;
  },
};

// =============================================================================
// Content Recommendation Utilities
// =============================================================================

export const recommendationUtils = {
  /**
   * Get personalized content recommendations
   */
  getRecommendations: (
    user: User,
    availableContent: AudioContent[],
    limit: number = 10
  ): AudioContent[] => {
    const { preferences, stats } = user;
    
    // Score content based on user preferences
    const scoredContent = availableContent.map(content => {
      let score = 0;
      
      // Favorite genres boost
      if (preferences.favoriteGenres.includes(content.category)) {
        score += 10;
      }
      
      // Rating boost
      score += content.rating * 2;
      
      // Completion rate boost (if user tends to complete content)
      if (stats.favoriteContent.some(fav => fav.category === content.category)) {
        score += 5;
      }
      
      // Duration preference (based on user's average listening time)
      const avgDuration = stats.totalListeningTime / stats.sleepSessions;
      const durationScore = 10 - Math.abs(content.duration - avgDuration) / 60;
      score += Math.max(0, durationScore);
      
      return { ...content, score };
    });
    
    // Sort by score and return top recommendations
    return scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
  
  /**
   * Get content similar to a specific item
   */
  getSimilarContent: (
    targetContent: AudioContent,
    availableContent: AudioContent[],
    limit: number = 5
  ): AudioContent[] => {
    const similar = availableContent
      .filter(content => content.id !== targetContent.id)
      .map(content => {
        let similarity = 0;
        
        // Same category
        if (content.category === targetContent.category) {
          similarity += 5;
        }
        
        // Similar duration
        const durationDiff = Math.abs(content.duration - targetContent.duration);
        similarity += Math.max(0, 5 - durationDiff / 300); // 5 min chunks
        
        // Same author
        if (content.author === targetContent.author) {
          similarity += 3;
        }
        
        // Similar tags
        const commonTags = content.tags.filter(tag => 
          targetContent.tags.includes(tag)
        ).length;
        similarity += commonTags;
        
        return { ...content, similarity };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
    
    return similar;
  },
};

// =============================================================================
// Analytics Utilities
// =============================================================================

export const analyticsUtils = {
  /**
   * Track user engagement
   */
  calculateEngagementScore: (user: User): number => {
    const { stats } = user;
    let score = 0;
    
    // Streak bonus
    score += stats.currentStreak * 2;
    
    // Session frequency
    score += Math.min(stats.sleepSessions / 30, 10) * 5; // Max 10 points for 30+ sessions
    
    // Listening time
    score += Math.min(stats.totalListeningTime / 3600, 10) * 3; // Max 10 points for 10+ hours
    
    return Math.min(100, score);
  },
  
  /**
   * Generate usage insights
   */
  generateInsights: (user: User): string[] => {
    const insights: string[] = [];
    const { stats, preferences } = user;
    
    // Streak insights
    if (stats.currentStreak >= 7) {
      insights.push(`🔥 Amazing! You're on a ${stats.currentStreak}-day streak!`);
    }
    
    // Listening time insights
    const avgDailyTime = stats.totalListeningTime / 30; // Assume 30 days
    if (avgDailyTime > 60) {
      insights.push('🎧 You\'re a dedicated listener! Consider trying new categories.');
    }
    
    // Sleep goal insights
    if (preferences.sleepGoal > 8) {
      insights.push('😴 Your sleep goal is ambitious! Try our deep sleep content.');
    }
    
    return insights;
  },
};

// =============================================================================
// Network & Connectivity Utilities
// =============================================================================

export const networkUtils = {
  /**
   * Check if device is connected to WiFi
   */
  isWiFiConnected: async (): Promise<boolean> => {
    // This would require a network info library
    // For now, return a mock value
    return true;
  },
  
  /**
   * Estimate download time
   */
  estimateDownloadTime: (fileSizeBytes: number, connectionType: 'wifi' | '4g' | '3g'): number => {
    const speeds = {
      wifi: 10000000, // 10 Mbps
      '4g': 5000000,  // 5 Mbps
      '3g': 1000000,  // 1 Mbps
    };
    
    const bitsPerSecond = speeds[connectionType];
    const bytes = fileSizeBytes;
    const seconds = (bytes * 8) / bitsPerSecond;
    
    return Math.ceil(seconds);
  },
  
  /**
   * Retry failed requests with exponential backoff
   */
  retryWithBackoff: async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  },
};