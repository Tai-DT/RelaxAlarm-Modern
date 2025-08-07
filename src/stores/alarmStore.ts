/**
 * Basic Alarm Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  isEnabled: boolean;
  repeatDays: string[];
  soundId: string;
  vibration: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number;
}

interface AlarmState {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
}

export const useAlarmStore = create<AlarmState>()()
  persist(
    (set, get) => ({
      alarms: [],
      
      addAlarm: (alarmData) => {
        const alarm: Alarm = {
          ...alarmData,
          id: Date.now().toString(),
        };
        set((state) => ({ alarms: [...state.alarms, alarm] }));
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
            alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm
          ),
        }));
      },
    }),
    {
      name: 'alarm-storage',
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