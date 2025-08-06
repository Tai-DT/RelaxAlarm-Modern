/**
 * Advanced Alarm Store with Smart Features
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm } from '../types';

export interface AlarmStore {
  alarms: Alarm[];
  
  // Actions
  addAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  
  // Smart features
  getNextAlarm: () => Alarm | null;
  getActiveAlarms: () => Alarm[];
  snoozeAlarm: (id: string, minutes?: number) => void;
  
  // Bulk operations
  toggleAllAlarms: (enabled: boolean) => void;
  deleteAllAlarms: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAlarmStore = create<AlarmStore>()(n  persist(
    (set, get) => ({
      alarms: [],
      
      addAlarm: (alarmData) => {
        const newAlarm: Alarm = {
          ...alarmData,
          id: generateId(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          alarms: [...state.alarms, newAlarm].sort((a, b) => 
            new Date(a.time).getTime() - new Date(b.time).getTime()
          ),
        }));
      },
      
      updateAlarm: (id, updates) => {
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, ...updates } : alarm
          ),
        }));
      },
      
      deleteAlarm: (id) => {
        set((state) => ({
          alarms: state.alarms.filter((alarm) => alarm.id !== id),
        }));
      },
      
      toggleAlarm: (id) => {
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
          ),
        }));
      },
      
      getNextAlarm: () => {
        const { alarms } = get();
        const activeAlarms = alarms.filter(alarm => alarm.isActive);
        
        if (activeAlarms.length === 0) return null;
        
        const now = new Date();
        const today = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        // Find next alarm considering repeat days
        let nextAlarm: Alarm | null = null;
        let nearestTime = Infinity;
        
        for (const alarm of activeAlarms) {
          const alarmTime = new Date(alarm.time);
          const alarmMinutes = alarmTime.getHours() * 60 + alarmTime.getMinutes();
          
          if (alarm.repeatDays && alarm.repeatDays.length > 0) {
            // Check each repeat day
            for (const day of alarm.repeatDays) {
              let daysUntilAlarm = (day - today + 7) % 7;
              
              // If it's today and the time hasn't passed yet
              if (daysUntilAlarm === 0 && alarmMinutes > currentTime) {
                const minutesUntilAlarm = alarmMinutes - currentTime;
                if (minutesUntilAlarm < nearestTime) {
                  nearestTime = minutesUntilAlarm;
                  nextAlarm = alarm;
                }
              }
              // If it's a future day
              else if (daysUntilAlarm > 0) {
                const minutesUntilAlarm = daysUntilAlarm * 24 * 60 + alarmMinutes - currentTime;
                if (minutesUntilAlarm < nearestTime) {
                  nearestTime = minutesUntilAlarm;
                  nextAlarm = alarm;
                }
              }
            }
          } else {
            // One-time alarm
            if (alarmMinutes > currentTime) {
              const minutesUntilAlarm = alarmMinutes - currentTime;
              if (minutesUntilAlarm < nearestTime) {
                nearestTime = minutesUntilAlarm;
                nextAlarm = alarm;
              }
            }
          }
        }
        
        return nextAlarm;
      },
      
      getActiveAlarms: () => {
        const { alarms } = get();
        return alarms.filter(alarm => alarm.isActive);
      },
      
      snoozeAlarm: (id, minutes = 10) => {
        const { alarms } = get();
        const alarm = alarms.find(a => a.id === id);
        
        if (!alarm) return;
        
        const snoozeTime = new Date();
        snoozeTime.setMinutes(snoozeTime.getMinutes() + minutes);
        
        set((state) => ({
          alarms: state.alarms.map((a) =>
            a.id === id
              ? {
                  ...a,
                  time: snoozeTime,
                  isActive: true,
                  label: `${a.label} (Snoozed)`,
                }
              : a
          ),
        }));
      },
      
      toggleAllAlarms: (enabled) => {
        set((state) => ({
          alarms: state.alarms.map((alarm) => ({
            ...alarm,
            isActive: enabled,
          })),
        }));
      },
      
      deleteAllAlarms: () => {
        set({ alarms: [] });
      },
    }),
    {
      name: 'alarm-store',
      storage: {
        getItem: (name) => AsyncStorage.getItem(name),
        setItem: (name, value) => AsyncStorage.setItem(name, value),
        removeItem: (name) => AsyncStorage.removeItem(name),
      },
    }
  )
);