/**
 * Smart Alarm Service with Adaptive Features
 */

import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Audio } from 'expo-av';
import { Alarm, SleepCycle } from '../types';
import { useAlarmStore } from '../stores';

export interface SmartAlarmServiceInterface {
  // Alarm scheduling
  scheduleAlarm: (alarm: Alarm) => Promise<string>;
  cancelAlarm: (alarmId: string) => Promise<void>;
  snoozeAlarm: (alarmId: string, minutes?: number) => Promise<void>;
  
  // Smart wake-up
  enableSmartWakeUp: (alarm: Alarm, sleepCycle: SleepCycle) => Promise<void>;
  disableSmartWakeUp: (alarmId: string) => Promise<void>;
  
  // Gradual wake-up
  startGradualWakeUp: (alarm: Alarm) => Promise<void>;
  stopGradualWakeUp: () => Promise<void>;
  
  // Sleep tracking integration
  setSleepTrackingCallback: (callback: (data: SleepData) => void) => void;
  startSleepTracking: () => Promise<void>;
  stopSleepTracking: () => Promise<void>;
  
  // Weather integration
  getWeatherBasedAlarmTime: (targetTime: Date) => Promise<Date>;
}

interface SleepData {
  sleepStage: 'light' | 'deep' | 'rem' | 'awake';
  timestamp: Date;
  heartRate?: number;
  movement?: number;
}

const SMART_ALARM_TASK = 'smart-alarm-background-task';
const SLEEP_TRACKING_TASK = 'sleep-tracking-task';

class SmartAlarmServiceImpl implements SmartAlarmServiceInterface {
  private gradualWakeUpSound: Audio.Sound | null = null;
  private sleepTrackingCallback?: (data: SleepData) => void;
  private isTrackingSleep = false;
  
  constructor() {
    this.initializeNotifications();
    this.registerBackgroundTasks();
  }
  
  private async initializeNotifications() {
    await Notifications.requestPermissionsAsync();
    
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
  
  private registerBackgroundTasks() {
    TaskManager.defineTask(SMART_ALARM_TASK, ({ data, error }) => {
      if (error) {
        console.error('Smart alarm background task error:', error);
        return;
      }
      
      // Handle smart alarm logic in background
      this.handleSmartAlarmTrigger(data);
    });
    
    TaskManager.defineTask(SLEEP_TRACKING_TASK, ({ data, error }) => {
      if (error) {
        console.error('Sleep tracking background task error:', error);
        return;
      }
      
      // Handle sleep tracking data
      this.processSleepTrackingData(data);
    });
  }
  
  async scheduleAlarm(alarm: Alarm): Promise<string> {
    try {
      const alarmTime = new Date(alarm.time);
      const now = new Date();
      
      // Calculate trigger time
      let triggerTime = alarmTime;
      if (triggerTime.getTime() <= now.getTime()) {
        triggerTime.setDate(triggerTime.getDate() + 1);
      }
      
      // Schedule notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Gentle Wake Up 🌅',
          body: alarm.label || 'Time to wake up peacefully',
          sound: alarm.soundUri || 'gentle-chime.wav',
          vibrate: alarm.vibrate ? [0, 250, 250, 250] : [],
          data: {
            alarmId: alarm.id,
            type: 'alarm',
          },
        },
        trigger: {
          date: triggerTime,
          repeats: alarm.repeatDays && alarm.repeatDays.length > 0,
        },
      });
      
      // If it's a smart alarm, schedule additional logic
      if (alarm.isSmartAlarm) {
        await this.scheduleSmartAlarmWindow(alarm, triggerTime);
      }
      
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule alarm:', error);
      throw error;
    }
  }
  
  async cancelAlarm(alarmId: string): Promise<void> {
    try {
      // Get all scheduled notifications
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      // Find and cancel alarm notifications
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.alarmId === alarmId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Failed to cancel alarm:', error);
    }
  }
  
  async snoozeAlarm(alarmId: string, minutes = 10): Promise<void> {
    try {
      const snoozeTime = new Date();
      snoozeTime.setMinutes(snoozeTime.getMinutes() + minutes);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Gentle Reminder 😴',
          body: `Snoozed for ${minutes} minutes`,
          sound: 'gentle-chime.wav',
          data: {
            alarmId,
            type: 'snooze',
          },
        },
        trigger: {
          date: snoozeTime,
        },
      });
      
      // Update alarm store
      useAlarmStore.getState().snoozeAlarm(alarmId, minutes);
    } catch (error) {
      console.error('Failed to snooze alarm:', error);
    }
  }
  
  async enableSmartWakeUp(alarm: Alarm, sleepCycle: SleepCycle): Promise<void> {
    try {
      // Start sleep tracking before the alarm
      const trackingStart = new Date(alarm.time);
      trackingStart.setMinutes(trackingStart.getMinutes() - 30); // Start 30 min before
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Sleep Tracking Started',
          body: 'Monitoring your sleep for optimal wake-up time',
          sound: false,
          data: {
            alarmId: alarm.id,
            type: 'sleep_tracking_start',
          },
        },
        trigger: {
          date: trackingStart,
        },
      });
    } catch (error) {
      console.error('Failed to enable smart wake-up:', error);
    }
  }
  
  async disableSmartWakeUp(alarmId: string): Promise<void> {
    // Cancel smart alarm related notifications
    await this.cancelAlarm(alarmId);
  }
  
  async startGradualWakeUp(alarm: Alarm): Promise<void> {
    try {
      // Load gentle wake-up sound
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/gradual-sunrise.mp3'),
        {
          shouldPlay: true,
          isLooping: true,
          volume: 0.1, // Start very quietly
        }
      );
      
      this.gradualWakeUpSound = sound;
      
      // Gradually increase volume over 10 minutes
      this.startVolumeGradient(sound, 0.1, 0.8, 10 * 60 * 1000);
      
      // Add light simulation if supported
      await this.simulateSunriseLight();
      
    } catch (error) {
      console.error('Failed to start gradual wake-up:', error);
    }
  }
  
  async stopGradualWakeUp(): Promise<void> {
    if (this.gradualWakeUpSound) {
      await this.gradualWakeUpSound.stopAsync();
      await this.gradualWakeUpSound.unloadAsync();
      this.gradualWakeUpSound = null;
    }
  }
  
  setSleepTrackingCallback(callback: (data: SleepData) => void): void {
    this.sleepTrackingCallback = callback;
  }
  
  async startSleepTracking(): Promise<void> {
    if (this.isTrackingSleep) return;
    
    this.isTrackingSleep = true;
    
    // Start monitoring device sensors for sleep tracking
    // This would require native modules for accelerometer/heart rate
    console.log('Sleep tracking started');
  }
  
  async stopSleepTracking(): Promise<void> {
    this.isTrackingSleep = false;
    console.log('Sleep tracking stopped');
  }
  
  async getWeatherBasedAlarmTime(targetTime: Date): Promise<Date> {
    try {
      // Fetch weather data (mock implementation)
      const weather = await this.fetchWeatherData();
      
      // Adjust alarm time based on weather conditions
      let adjustedTime = new Date(targetTime);
      
      if (weather.condition === 'rainy' || weather.condition === 'snowy') {
        // Add 15 minutes for bad weather
        adjustedTime.setMinutes(adjustedTime.getMinutes() + 15);
      } else if (weather.condition === 'sunny' && weather.temperature > 25) {
        // Subtract 10 minutes for beautiful weather
        adjustedTime.setMinutes(adjustedTime.getMinutes() - 10);
      }
      
      return adjustedTime;
    } catch (error) {
      console.error('Failed to get weather-based alarm time:', error);
      return targetTime;
    }
  }
  
  private async scheduleSmartAlarmWindow(alarm: Alarm, triggerTime: Date): Promise<void> {
    // Schedule multiple alarms within a 30-minute window before the target time
    const windowStart = new Date(triggerTime);
    windowStart.setMinutes(windowStart.getMinutes() - 30);
    
    // Schedule check points every 5 minutes
    for (let i = 0; i < 6; i++) {
      const checkTime = new Date(windowStart);
      checkTime.setMinutes(checkTime.getMinutes() + i * 5);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Smart Alarm Check',
          body: 'Checking optimal wake-up time',
          sound: false,
          data: {
            alarmId: alarm.id,
            type: 'smart_check',
            checkIndex: i,
          },
        },
        trigger: {
          date: checkTime,
        },
      });
    }
  }
  
  private async startVolumeGradient(
    sound: Audio.Sound,
    startVolume: number,
    endVolume: number,
    duration: number
  ): Promise<void> {
    const steps = 60; // Update every second
    const stepDuration = duration / steps;
    const volumeStep = (endVolume - startVolume) / steps;
    
    for (let i = 0; i <= steps; i++) {
      const currentVolume = startVolume + volumeStep * i;
      await sound.setVolumeAsync(currentVolume);
      
      if (i < steps) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }
    }
  }
  
  private async simulateSunriseLight(): Promise<void> {
    // This would control smart lights if available
    // For now, just log the simulation
    console.log('Simulating sunrise lighting');
  }
  
  private async fetchWeatherData(): Promise<{ condition: string; temperature: number }> {
    // Mock weather data - in real app, integrate with weather API
    return {
      condition: 'sunny',
      temperature: 22,
    };
  }
  
  private handleSmartAlarmTrigger(data: any): void {
    // Process smart alarm trigger in background
    console.log('Smart alarm triggered:', data);
  }
  
  private processSleepTrackingData(data: any): void {
    // Process sleep tracking data
    if (this.sleepTrackingCallback) {
      this.sleepTrackingCallback(data);
    }
  }
}

export const smartAlarmService: SmartAlarmServiceInterface = new SmartAlarmServiceImpl();