/**
 * Notification Service - Modern push notifications and local scheduling
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  type: 'alarm' | 'sleep' | 'reminder' | 'content';
  id: string;
  data?: any;
}

export interface AlarmNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  isActive: boolean;
  repeatDays?: number[]; // 0-6, Sunday-Saturday
  soundUri?: string;
}

class NotificationService {
  private initialized = false;
  
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return;
      }
      
      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('alarms', {
          name: 'Alarms',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4F8A6E',
          sound: 'default',
        });
        
        await Notifications.setNotificationChannelAsync('reminders', {
          name: 'Reminders',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250],
          lightColor: '#4F8A6E',
        });
      }
      
      // Get push token for remote notifications
      if (Device.isDevice) {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: 'your-expo-project-id', // Replace with your project ID
        });
        console.log('Push token:', token.data);
        
        // Store token for server
        await AsyncStorage.setItem('push_token', token.data);
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }
  
  async scheduleAlarm(alarm: AlarmNotification): Promise<string> {
    try {
      const trigger = alarm.repeatDays && alarm.repeatDays.length > 0
        ? {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: alarm.repeatDays[0] + 1, // Convert to 1-7 format
            hour: alarm.scheduledTime.getHours(),
            minute: alarm.scheduledTime.getMinutes(),
            repeats: true,
          } as Notifications.WeeklyTriggerInput
        : {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: alarm.scheduledTime,
          } as Notifications.DateTriggerInput;
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: alarm.title,
          body: alarm.body,
          sound: alarm.soundUri || 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          categoryIdentifier: 'alarm',
          data: {
            type: 'alarm',
            id: alarm.id,
            alarmId: alarm.id,
          } as NotificationData,
        },
        trigger,
      });
      
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule alarm:', error);
      throw error;
    }
  }
  
  async cancelAlarm(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel alarm:', error);
    }
  }
  
  async cancelAllAlarms(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all alarms:', error);
    }
  }
  
  async scheduleSleepReminder(time: Date, message: string): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Sleep Reminder 🌙',
          body: message,
          sound: 'default',
          data: {
            type: 'sleep',
            id: Date.now().toString(),
          } as NotificationData,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: time,
        },
      });
      
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule sleep reminder:', error);
      throw error;
    }
  }
  
  async scheduleContentReminder(
    contentTitle: string,
    time: Date,
    contentId: string
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Continue Listening 🎧',
          body: `Continue with "${contentTitle}"`,
          sound: 'default',
          data: {
            type: 'content',
            id: contentId,
            contentId,
          } as NotificationData,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: time,
        },
      });
      
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule content reminder:', error);
      throw error;
    }
  }
  
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }
  
  async sendLocalNotification(
    title: string,
    body: string,
    data?: NotificationData
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          data,
        },
        trigger: null, // Send immediately
      });
      
      return notificationId;
    } catch (error) {
      console.error('Failed to send local notification:', error);
      throw error;
    }
  }
  
  // Notification response handlers
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }
  
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }
  
  // Badge management
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }
  
  async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Failed to clear badge:', error);
    }
  }
  
  // Permission utilities
  async hasPermissions(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }
  
  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }
}

// Singleton instance
export const notificationService = new NotificationService();
export default notificationService;