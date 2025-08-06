/**
 * Audio Services - Modern audio playback with background support
 */

import { Audio, AVPlaybackStatus } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { AudioContent, PlaybackState, PlayerState } from '../types';

export class AudioService {
  private sound: Audio.Sound | null = null;
  private currentContent: AudioContent | null = null;
  private playbackState: PlaybackState = 'stopped';
  private position: number = 0;
  private duration: number = 0;
  private onStateChange: ((state: PlayerState) => void) | null = null;
  
  constructor() {
    this.initializeAudio();
  }
  
  private async initializeAudio() {
    try {
      // Configure audio session for background playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }
  
  async loadContent(content: AudioContent): Promise<void> {
    try {
      // Unload previous content
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      // Create new sound instance
      const { sound } = await Audio.Sound.createAsync(
        { uri: content.url },
        {
          shouldPlay: false,
          isLooping: false,
          volume: 1.0,
        },
        this.onPlaybackStatusUpdate.bind(this)
      );
      
      this.sound = sound;
      this.currentContent = content;
      this.playbackState = 'stopped';
      
      // Get duration
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        this.duration = status.durationMillis || 0;
      }
      
      this.notifyStateChange();
    } catch (error) {
      console.error('Failed to load audio content:', error);
      throw error;
    }
  }
  
  async play(): Promise<void> {
    if (!this.sound) {
      throw new Error('No audio content loaded');
    }
    
    try {
      await this.sound.playAsync();
      this.playbackState = 'playing';
      this.notifyStateChange();
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }
  
  async pause(): Promise<void> {
    if (!this.sound) {
      throw new Error('No audio content loaded');
    }
    
    try {
      await this.sound.pauseAsync();
      this.playbackState = 'paused';
      this.notifyStateChange();
    } catch (error) {
      console.error('Failed to pause audio:', error);
      throw error;
    }
  }
  
  async stop(): Promise<void> {
    if (!this.sound) {
      return;
    }
    
    try {
      await this.sound.stopAsync();
      await this.sound.setPositionAsync(0);
      this.playbackState = 'stopped';
      this.position = 0;
      this.notifyStateChange();
    } catch (error) {
      console.error('Failed to stop audio:', error);
      throw error;
    }
  }
  
  async seekTo(positionMillis: number): Promise<void> {
    if (!this.sound) {
      throw new Error('No audio content loaded');
    }
    
    try {
      await this.sound.setPositionAsync(positionMillis);
      this.position = positionMillis;
      this.notifyStateChange();
    } catch (error) {
      console.error('Failed to seek audio:', error);
      throw error;
    }
  }
  
  async setVolume(volume: number): Promise<void> {
    if (!this.sound) {
      throw new Error('No audio content loaded');
    }
    
    try {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      await this.sound.setVolumeAsync(clampedVolume);
    } catch (error) {
      console.error('Failed to set volume:', error);
      throw error;
    }
  }
  
  async setPlaybackRate(rate: number): Promise<void> {
    if (!this.sound) {
      throw new Error('No audio content loaded');
    }
    
    try {
      const clampedRate = Math.max(0.5, Math.min(2.0, rate));
      await this.sound.setRateAsync(clampedRate, true);
    } catch (error) {
      console.error('Failed to set playback rate:', error);
      throw error;
    }
  }
  
  getState(): PlayerState {
    return {
      currentContent: this.currentContent,
      playbackState: this.playbackState,
      position: this.position,
      duration: this.duration,
      volume: 1.0,
      playbackRate: 1.0,
      isLoading: false,
      error: null,
    };
  }
  
  setStateChangeListener(callback: (state: PlayerState) => void): void {
    this.onStateChange = callback;
  }
  
  removeStateChangeListener(): void {
    this.onStateChange = null;
  }
  
  private onPlaybackStatusUpdate(status: AVPlaybackStatus): void {
    if (status.isLoaded) {
      this.position = status.positionMillis || 0;
      this.duration = status.durationMillis || 0;
      
      if (status.didJustFinish) {
        this.playbackState = 'stopped';
        this.position = 0;
      }
      
      this.notifyStateChange();
    }
  }
  
  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }
  
  async cleanup(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
      
      this.currentContent = null;
      this.playbackState = 'stopped';
      this.position = 0;
      this.duration = 0;
      this.onStateChange = null;
    } catch (error) {
      console.error('Failed to cleanup audio service:', error);
    }
  }
}

// Singleton instance
export const audioService = new AudioService();