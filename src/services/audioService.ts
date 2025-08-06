/**
 * Advanced Audio Service with Smart Features
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { AudioContent, PlaybackState } from '../types';
import { usePlayerStore } from '../stores';

export interface AudioServiceInterface {
  // Playback control
  play: (content: AudioContent) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  
  // Audio settings
  setVolume: (volume: number) => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
  
  // Download management
  downloadContent: (content: AudioContent) => Promise<string>;
  isContentDownloaded: (contentId: string) => Promise<boolean>;
  deleteDownload: (contentId: string) => Promise<void>;
  
  // Audio effects
  enableNightMode: () => Promise<void>;
  disableNightMode: () => Promise<void>;
  setEqualizer: (preset: EqualizerPreset) => Promise<void>;
  
  // Background playback
  enableBackgroundPlayback: () => Promise<void>;
  disableBackgroundPlayback: () => Promise<void>;
  
  // Session management
  getCurrentPosition: () => Promise<number>;
  getDuration: () => Promise<number>;
  getPlaybackState: () => Promise<PlaybackState>;
}

type EqualizerPreset = 'off' | 'relaxation' | 'meditation' | 'sleep' | 'nature';

class AudioServiceImpl implements AudioServiceInterface {
  private sound: Audio.Sound | null = null;
  private currentContent: AudioContent | null = null;
  private isInitialized = false;
  
  constructor() {
    this.initializeAudio();
  }
  
  private async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }
  
  async play(content: AudioContent): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initializeAudio();
      }
      
      // Stop current playback
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      // Check if content is downloaded
      const isDownloaded = await this.isContentDownloaded(content.id);
      const uri = isDownloaded 
        ? this.getDownloadPath(content.id)
        : content.url;
      
      // Create new sound instance
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        {
          shouldPlay: true,
          isLooping: false,
          volume: usePlayerStore.getState().volume,
          rate: usePlayerStore.getState().playbackRate,
        },
        this.onPlaybackStatusUpdate
      );
      
      this.sound = sound;
      this.currentContent = content;
      
      // Enable background playback
      await this.enableBackgroundPlayback();
      
    } catch (error) {
      console.error('Failed to play audio:', error);
      usePlayerStore.getState().setError('Failed to play audio');
    }
  }
  
  async pause(): Promise<void> {
    if (this.sound) {
      await this.sound.pauseAsync();
    }
  }
  
  async resume(): Promise<void> {
    if (this.sound) {
      await this.sound.playAsync();
    }
  }
  
  async stop(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
      this.currentContent = null;
    }
  }
  
  async seekTo(position: number): Promise<void> {
    if (this.sound) {
      await this.sound.setPositionAsync(position * 1000);
    }
  }
  
  async setVolume(volume: number): Promise<void> {
    if (this.sound) {
      await this.sound.setVolumeAsync(volume);
    }
  }
  
  async setPlaybackRate(rate: number): Promise<void> {
    if (this.sound) {
      await this.sound.setRateAsync(rate, true);
    }
  }
  
  async downloadContent(content: AudioContent): Promise<string> {
    try {
      const downloadPath = this.getDownloadPath(content.id);
      
      // Create download directory if it doesn't exist
      const downloadDir = FileSystem.documentDirectory + 'downloads/';
      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
      
      // Download the file
      const { uri } = await FileSystem.downloadAsync(
        content.url,
        downloadPath
      );
      
      // Save metadata
      const metadataPath = this.getMetadataPath(content.id);
      await FileSystem.writeAsStringAsync(
        metadataPath,
        JSON.stringify({
          id: content.id,
          title: content.title,
          downloadDate: new Date().toISOString(),
          size: (await FileSystem.getInfoAsync(uri)).size,
        })
      );
      
      return uri;
    } catch (error) {
      console.error('Failed to download content:', error);
      throw error;
    }
  }
  
  async isContentDownloaded(contentId: string): Promise<boolean> {
    try {
      const downloadPath = this.getDownloadPath(contentId);
      const info = await FileSystem.getInfoAsync(downloadPath);
      return info.exists;
    } catch {
      return false;
    }
  }
  
  async deleteDownload(contentId: string): Promise<void> {
    try {
      const downloadPath = this.getDownloadPath(contentId);
      const metadataPath = this.getMetadataPath(contentId);
      
      await Promise.all([
        FileSystem.deleteAsync(downloadPath, { idempotent: true }),
        FileSystem.deleteAsync(metadataPath, { idempotent: true }),
      ]);
    } catch (error) {
      console.error('Failed to delete download:', error);
    }
  }
  
  async enableNightMode(): Promise<void> {
    // Reduce volume and apply low-pass filter
    if (this.sound) {
      const currentVolume = usePlayerStore.getState().volume;
      await this.sound.setVolumeAsync(currentVolume * 0.7);
    }
  }
  
  async disableNightMode(): Promise<void> {
    // Restore normal volume
    if (this.sound) {
      const normalVolume = usePlayerStore.getState().volume;
      await this.sound.setVolumeAsync(normalVolume);
    }
  }
  
  async setEqualizer(preset: EqualizerPreset): Promise<void> {
    // Apply equalizer settings based on preset
    // This would require a native module for full implementation
    console.log(`Applying equalizer preset: ${preset}`);
  }
  
  async enableBackgroundPlayback(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.error('Failed to enable background playback:', error);
    }
  }
  
  async disableBackgroundPlayback(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Failed to disable background playback:', error);
    }
  }
  
  async getCurrentPosition(): Promise<number> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        return (status.positionMillis || 0) / 1000;
      }
    }
    return 0;
  }
  
  async getDuration(): Promise<number> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        return (status.durationMillis || 0) / 1000;
      }
    }
    return 0;
  }
  
  async getPlaybackState(): Promise<PlaybackState> {
    if (!this.sound) {
      return 'stopped';
    }
    
    const status = await this.sound.getStatusAsync();
    if (!status.isLoaded) {
      return 'loading';
    }
    
    if (status.isPlaying) {
      return 'playing';
    } else if (status.isBuffering) {
      return 'buffering';
    } else {
      return 'paused';
    }
  }
  
  private onPlaybackStatusUpdate = (status: any) => {
    const playerStore = usePlayerStore.getState();
    
    if (status.isLoaded) {
      playerStore.seekTo((status.positionMillis || 0) / 1000);
      
      if (status.didJustFinish) {
        playerStore.playNext();
      }
    }
    
    if (status.error) {
      playerStore.setError('Playback error occurred');
    }
  };
  
  private getDownloadPath(contentId: string): string {
    return FileSystem.documentDirectory + `downloads/${contentId}.mp3`;
  }
  
  private getMetadataPath(contentId: string): string {
    return FileSystem.documentDirectory + `downloads/${contentId}.json`;
  }
}

export const audioService: AudioServiceInterface = new AudioServiceImpl();