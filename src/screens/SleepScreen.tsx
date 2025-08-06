/**
 * Modern Sleep Tracking Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  FadeInDown,
  BounceIn,
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';

// Import components
import { Header, Card, Button } from '../components/ui';

// Import stores and types
import { useSleepStore, useThemeStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';
import { SleepSession, MainTabParamList } from '../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type SleepScreenProps = BottomTabScreenProps<MainTabParamList, 'Sleep'>;

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 48;
const CHART_RADIUS = (CHART_SIZE - 40) / 2;
const CHART_STROKE_WIDTH = 12;
const CHART_CIRCUMFERENCE = 2 * Math.PI * CHART_RADIUS;

const SleepScreen: React.FC<SleepScreenProps> = ({ navigation }) => {
  const { 
    isTracking, 
    currentSession, 
    recentSessions, 
    getSleepStats,
    startSleep,
    stopSleep,
  } = useSleepStore();
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  const sleepStats = getSleepStats();
  
  // Animations
  const headerOpacity = useSharedValue(0);
  const chartProgress = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    chartProgress.value = withDelay(300, withTiming(1, { duration: 1200 }));
    statsOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  const chartAnimatedStyle = useAnimatedStyle(() => {
    const progress = chartProgress.value;
    const targetHours = sleepStats.averageDuration || 8;
    const normalizedProgress = (targetHours / 12) * progress; // Normalize to 12h scale
    
    return {
      transform: [{ rotate: `${-90 + (360 * normalizedProgress)}deg` }],
    };
  });
  
  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));
  
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const renderSleepChart = () => {
    const averageDuration = sleepStats.averageDuration || 8;
    const progressPercentage = (averageDuration / 12) * 100; // 12h as max
    const strokeDasharray = CHART_CIRCUMFERENCE;
    const strokeDashoffset = CHART_CIRCUMFERENCE * (1 - progressPercentage / 100);
    
    return (
      <Animated.View style={[styles.chartContainer, headerAnimatedStyle]}>
        <Card variant="filled" style={styles.chartCard}>
          <LinearGradient
            colors={[
              theme.colors.primary + '20',
              theme.colors.secondary + '10',
            ]}
            style={styles.chartGradient}
          >
            <View style={styles.chartWrapper}>
              <Svg width={CHART_SIZE} height={CHART_SIZE} style={styles.chart}>
                {/* Background circle */}
                <Circle
                  cx={CHART_SIZE / 2}
                  cy={CHART_SIZE / 2}
                  r={CHART_RADIUS}
                  stroke={theme.colors.outlineVariant}
                  strokeWidth={CHART_STROKE_WIDTH}
                  fill="none"
                  strokeLinecap="round"
                />
                
                {/* Progress circle */}
                <Animated.View style={chartAnimatedStyle}>
                  <Circle
                    cx={CHART_SIZE / 2}
                    cy={CHART_SIZE / 2}
                    r={CHART_RADIUS}
                    stroke={theme.colors.primary}
                    strokeWidth={CHART_STROKE_WIDTH}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                </Animated.View>
              </Svg>
              
              <View style={styles.chartCenter}>
                <Animated.View entering={BounceIn.delay(800)}>
                  <Text style={[styles.chartValue, { color: theme.colors.primary }]}>
                    {averageDuration.toFixed(1)}h
                  </Text>
                  <Text style={[styles.chartLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Avg Sleep
                  </Text>
                </Animated.View>
              </View>
            </View>
          </LinearGradient>
        </Card>
      </Animated.View>
    );
  };
  
  const renderCurrentSession = () => {
    if (!isTracking || !currentSession) return null;
    
    const duration = currentSession.endTime 
      ? (new Date(currentSession.endTime).getTime() - new Date(currentSession.startTime).getTime()) / (1000 * 60)
      : (Date.now() - new Date(currentSession.startTime).getTime()) / (1000 * 60);
    
    return (
      <Animated.View 
        style={styles.currentSessionContainer}
        entering={FadeInDown.delay(400).duration(600)}
      >
        <Card variant="elevated" padding="lg" style={styles.currentSessionCard}>
          <View style={styles.sessionHeader}>
            <View style={[styles.sessionStatus, { backgroundColor: theme.colors.primary + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.statusText, { color: theme.colors.primary }]}>
                Sleep Tracking Active
              </Text>
            </View>
          </View>
          
          <View style={styles.sessionContent}>
            <View style={styles.sessionTime}>
              <Text style={[styles.sessionDuration, { color: theme.colors.onSurface }]}>
                {formatDuration(Math.round(duration))}
              </Text>
              <Text style={[styles.sessionLabel, { color: theme.colors.onSurfaceVariant }]}>
                Current Session
              </Text>
            </View>
            
            <View style={styles.sessionActions}>
              <Button
                variant="filled"
                color="error"
                icon="stop"
                onPress={() => stopSleep(5)} // Default quality
                size="small"
              >
                Stop Tracking
              </Button>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };
  
  const renderSleepStats = () => (
    <Animated.View style={[styles.statsContainer, statsAnimatedStyle]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Sleep Insights
      </Text>
      
      <View style={styles.statsGrid}>
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name="bed" size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
            {sleepStats.totalSessions || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
            Sessions
          </Text>
        </Card>
        
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
            <Ionicons name="time" size={24} color={theme.colors.secondary} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
            {(sleepStats.totalDuration || 0).toFixed(1)}h
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
            Total Sleep
          </Text>
        </Card>
        
        <Card variant="outlined" padding="md" style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.tertiary + '20' }]}>
            <Ionicons name="star" size={24} color={theme.colors.tertiary} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
            {(sleepStats.averageQuality || 0).toFixed(1)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
            Avg Quality
          </Text>
        </Card>
      </View>
    </Animated.View>
  );
  
  const renderRecentSessions = () => {
    if (recentSessions.length === 0) return null;
    
    return (
      <Animated.View 
        style={styles.sessionsContainer}
        entering={FadeInDown.delay(600).duration(600)}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Recent Sessions
        </Text>
        
        {recentSessions.slice(0, 5).map((session, index) => {
          const duration = (new Date(session.endTime!).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60);
          
          return (
            <Animated.View
              key={session.id}
              entering={FadeInDown.delay((index + 1) * 100).duration(400)}
            >
              <Card variant="filled" padding="md" style={styles.sessionItem}>
                <View style={styles.sessionItemContent}>
                  <View style={styles.sessionItemInfo}>
                    <Text style={[styles.sessionDate, { color: theme.colors.onSurface }]}>
                      {new Date(session.startTime).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.sessionDurationSmall, { color: theme.colors.onSurfaceVariant }]}>
                      {duration.toFixed(1)}h
                    </Text>
                  </View>
                  
                  <View style={styles.sessionItemRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= session.quality ? 'star' : 'star-outline'}
                        size={16}
                        color={star <= session.quality ? theme.colors.tertiary : theme.colors.outline}
                      />
                    ))}
                  </View>
                </View>
              </Card>
            </Animated.View>
          );
        })}
      </Animated.View>
    );
  };
  
  const renderStartButton = () => {
    if (isTracking) return null;
    
    return (
      <Animated.View 
        style={styles.startButtonContainer}
        entering={FadeInDown.delay(800).duration(600)}
      >
        <Button
          variant="filled"
          color="primary"
          size="large"
          icon="moon"
          onPress={() => startSleep()}
          fullWidth
          style={styles.startButton}
        >
          Start Sleep Tracking
        </Button>
      </Animated.View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Sleep Tracker"
        rightIcon="calendar-outline"
        onRightPress={() => {
          // Navigate to sleep history
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSleepChart()}
        {renderCurrentSession()}
        {renderSleepStats()}
        {renderRecentSessions()}
        {renderStartButton()}
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
  chartContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  chartCard: {
    overflow: 'hidden',
  },
  chartGradient: {
    padding: 20,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    transform: [{ rotate: '-90deg' }],
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartValue: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  currentSessionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  currentSessionCard: {
    // Card styles handled by component
  },
  sessionHeader: {
    marginBottom: 16,
  },
  sessionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sessionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTime: {
    flex: 1,
  },
  sessionDuration: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sessionLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  sessionActions: {
    marginLeft: 16,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sessionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sessionItem: {
    marginBottom: 8,
  },
  sessionItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionItemInfo: {
    flex: 1,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  sessionDurationSmall: {
    fontSize: 12,
    marginTop: 2,
  },
  sessionItemRating: {
    flexDirection: 'row',
    gap: 2,
  },
  startButtonContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  startButton: {
    paddingVertical: 16,
  },
});

export default SleepScreen;