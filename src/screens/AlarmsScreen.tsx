/**
 * Modern Alarms Screen with Smart Scheduling
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Import components
import { Header, Card, Button } from '../components/ui';

// Import stores and types
import { useAlarmStore, useThemeStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';
import { Alarm, MainTabParamList } from '../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type AlarmsScreenProps = BottomTabScreenProps<MainTabParamList, 'Alarms'>;

const daysOfWeek = [
  { short: 'S', full: 'Sunday', index: 0 },
  { short: 'M', full: 'Monday', index: 1 },
  { short: 'T', full: 'Tuesday', index: 2 },
  { short: 'W', full: 'Wednesday', index: 3 },
  { short: 'T', full: 'Thursday', index: 4 },
  { short: 'F', full: 'Friday', index: 5 },
  { short: 'S', full: 'Saturday', index: 6 },
];

const AlarmsScreen: React.FC<AlarmsScreenProps> = ({ navigation }) => {
  const { alarms, toggleAlarm, deleteAlarm } = useAlarmStore();
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  // Animations
  const headerOpacity = useSharedValue(0);
  
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  const getNextAlarmTime = (alarm: Alarm): string => {
    if (!alarm.isActive) return 'Disabled';
    
    const now = new Date();
    let nextAlarm = new Date(alarm.time);
    
    // Set to today first
    nextAlarm.setFullYear(now.getFullYear());
    nextAlarm.setMonth(now.getMonth());
    nextAlarm.setDate(now.getDate());
    
    // If alarm time has passed today, set to tomorrow
    if (nextAlarm.getTime() <= now.getTime()) {
      nextAlarm.setDate(nextAlarm.getDate() + 1);
    }
    
    const diff = nextAlarm.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    } else {
      return `in ${minutes}m`;
    }
  };
  
  const handleDeleteAlarm = (alarmId: string) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAlarm(alarmId),
        },
      ]
    );
  };
  
  const renderEmptyState = () => (
    <Animated.View 
      style={styles.emptyContainer}
      entering={FadeInDown.delay(400).duration(600)}
    >
      <LinearGradient
        colors={[
          theme.colors.primaryContainer + '40',
          theme.colors.tertiaryContainer + '20',
        ]}
        style={styles.emptyGradient}
      >
        <View style={[styles.emptyIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Ionicons name="alarm-outline" size={48} color={theme.colors.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
          No Gentle Alarms Set 🌅
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Create your first peaceful alarm to wake up naturally
        </Text>
        
        <Button
          variant="filled"
          color="primary"
          icon="add"
          onPress={() => navigation.navigate('AlarmSettings')}
          style={styles.createButton}
        >
          Create First Alarm
        </Button>
      </LinearGradient>
    </Animated.View>
  );
  
  const renderAlarmCard = ({ item, index }: { item: Alarm; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      layout={Layout.springify()}
    >
      <Card
        variant="elevated"
        style={[
          styles.alarmCard,
          {
            backgroundColor: item.isActive 
              ? theme.colors.surfaceContainer 
              : theme.colors.surfaceVariant,
          },
        ]}
        onPress={() => navigation.navigate('AlarmSettings', { alarmId: item.id })}
      >
        <LinearGradient
          colors={[
            item.isActive 
              ? theme.colors.primaryContainer + '30'
              : theme.colors.surfaceVariant,
            'transparent',
          ]}
          style={styles.cardGradient}
        >
          <View style={styles.alarmHeader}>
            <View style={styles.timeContainer}>
              <Text style={[
                styles.timeText,
                {
                  color: item.isActive ? theme.colors.primary : theme.colors.onSurfaceVariant,
                },
              ]}>
                {formatTime(new Date(item.time))}
              </Text>
              <Text style={[
                styles.nextAlarmText,
                { color: theme.colors.onSurfaceVariant },
              ]}>
                {getNextAlarmTime(item)}
              </Text>
            </View>
            
            <Switch
              value={item.isActive}
              onValueChange={() => toggleAlarm(item.id)}
              trackColor={{
                false: theme.colors.outline,
                true: theme.colors.primary + '60',
              }}
              thumbColor={item.isActive ? theme.colors.primary : theme.colors.surface}
            />
          </View>
          
          <View style={styles.alarmInfo}>
            <Text style={[styles.alarmLabel, { color: theme.colors.onSurface }]}>
              {item.label}
            </Text>
            
            {item.soundUri && (
              <View style={styles.soundInfo}>
                <Ionicons name="musical-note" size={14} color={theme.colors.secondary} />
                <Text style={[styles.soundText, { color: theme.colors.onSurfaceVariant }]}>
                  Nature Sounds
                </Text>
              </View>
            )}
          </View>
          
          {item.repeatDays && item.repeatDays.length > 0 && (
            <View style={styles.repeatDays}>
              {daysOfWeek.map((day) => (
                <View
                  key={day.index}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: item.repeatDays!.includes(day.index)
                        ? theme.colors.primary
                        : theme.colors.outline,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: item.repeatDays!.includes(day.index)
                          ? theme.colors.onPrimary
                          : theme.colors.onSurfaceVariant,
                      },
                    ]}
                  >
                    {day.short}
                  </Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.alarmActions}>
            <Button
              variant="text"
              size="small"
              icon="create-outline"
              onPress={() => navigation.navigate('AlarmSettings', { alarmId: item.id })}
            >
              Edit
            </Button>
            
            <Button
              variant="text"
              size="small"
              color="error"
              icon="trash-outline"
              onPress={() => handleDeleteAlarm(item.id)}
            >
              Delete
            </Button>
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );
  
  const renderHeader = () => (
    <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
      <Card variant="filled" padding="lg" style={styles.headerCard}>
        <LinearGradient
          colors={[
            theme.colors.primaryContainer + '60',
            theme.colors.tertiaryContainer + '40',
          ]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
              Gentle Wake Up 🌅
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              {alarms.filter(a => a.isActive).length} active alarms set
            </Text>
            
            <Button
              variant="filled"
              color="primary"
              icon="add"
              onPress={() => navigation.navigate('AlarmSettings')}
              style={styles.addButton}
            >
              New Alarm
            </Button>
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Gentle Alarms ⏰"
        rightIcon="settings-outline"
        onRightPress={() => navigation.navigate('Settings')}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        
        {alarms.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.alarmsContainer}>
            <FlatList
              data={alarms}
              renderItem={renderAlarmCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerCard: {
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    paddingHorizontal: 32,
  },
  alarmsContainer: {
    paddingHorizontal: 24,
  },
  alarmCard: {
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  nextAlarmText: {
    fontSize: 14,
    marginTop: 4,
  },
  alarmInfo: {
    marginBottom: 12,
  },
  alarmLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  soundText: {
    fontSize: 14,
  },
  repeatDays: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dayChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alarmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  emptyContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyGradient: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  createButton: {
    paddingHorizontal: 32,
  },
});

export default AlarmsScreen;