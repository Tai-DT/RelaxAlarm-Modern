/**
 * Enhanced Modern Home Screen with Natural Forest Theme
 * Dynamic interface with wellness dashboard and smart recommendations
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import components and stores
import { Card, Button } from '../components/ui';
import { useThemeStore, useUserStore, usePlayerStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';
import { formatTime } from '../utils';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const { user } = useUserStore();
  const { currentTrack, isPlaying } = usePlayerStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const welcomeScale = useSharedValue(0.9);
  const statsProgress = useSharedValue(0);
  
  // Sample data
  const [todayStats] = useState({
    sleepHours: 7.5,
    meditationMinutes: 25,
    relaxationScore: 85,
    currentStreak: user?.stats.currentStreak || 5,
  });
  
  const [quickActions] = useState([
    {
      id: '1',
      title: 'Sleep Stories',
      subtitle: 'Drift into peaceful dreams',
      icon: 'book',
      color: theme.colors.primary,
      gradient: [theme.colors.primary + '20', theme.colors.primary + '10'],
    },
    {
      id: '2', 
      title: 'Nature Sounds',
      subtitle: 'Forest, rain, ocean waves',
      icon: 'leaf',
      color: theme.colors.tertiary,
      gradient: [theme.colors.tertiary + '20', theme.colors.tertiary + '10'],
    },
    {
      id: '3',
      title: 'Smart Alarm',
      subtitle: 'Gentle wake-up cycles',
      icon: 'alarm',
      color: theme.colors.secondary,
      gradient: [theme.colors.secondary + '20', theme.colors.secondary + '10'],
    },
    {
      id: '4',
      title: 'Meditation',
      subtitle: 'Mindfulness & breathing',
      icon: 'flower',
      color: '#8B5A3C',
      gradient: ['#8B5A3C20', '#8B5A3C10'],
    },
  ]);
  
  const [recommendations] = useState([
    {
      id: '1',
      title: 'Forest Rain Meditation',
      duration: '20 min',
      category: 'Nature',
      rating: 4.8,
      thumbnail: '🌧️',
    },
    {
      id: '2',
      title: 'Deep Sleep Piano',
      duration: '45 min',
      category: 'Sleep Music',
      rating: 4.9,
      thumbnail: '🎹',
    },
    {
      id: '3',
      title: 'Ocean Waves Story',
      duration: '35 min',
      category: 'Sleep Story',
      rating: 4.7,
      thumbnail: '🌊',
    },
  ]);
  
  useEffect(() => {
    // Start animations
    headerOpacity.value = withTiming(1, { duration: 800 });
    welcomeScale.value = withSpring(1, { damping: 15 });
    statsProgress.value = withTiming(1, { duration: 1200 });
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  const welcomeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: welcomeScale.value }],
  }));
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };
  
  const renderQuickAction = ({ item, index }: { item: any; index: number }) => (
    <Animated.View 
      entering={FadeInRight.delay(index * 100).duration(600)}
      style={styles.quickActionContainer}
    >
      <TouchableOpacity style={styles.quickAction}>
        <LinearGradient
          colors={item.gradient}
          style={styles.quickActionGradient}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon as any} size={24} color={item.color} />
          </View>
          <Text style={[styles.quickActionTitle, { color: theme.colors.onSurface }]}>
            {item.title}
          </Text>
          <Text style={[styles.quickActionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            {item.subtitle}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
  
  const renderRecommendation = ({ item, index }: { item: any; index: number }) => (
    <Animated.View 
      entering={FadeInUp.delay(index * 150).duration(600)}
      style={styles.recommendationItem}
    >
      <TouchableOpacity>
        <Card variant="elevated" style={styles.recommendationCard}>
          <LinearGradient
            colors={[
              theme.colors.surface,
              theme.colors.surfaceContainer + '80',
            ]}
            style={styles.recommendationGradient}
          >
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationThumbnail}>{item.thumbnail}</Text>
              
              <View style={styles.recommendationInfo}>
                <Text style={[styles.recommendationTitle, { color: theme.colors.onSurface }]}>
                  {item.title}
                </Text>
                <Text style={[styles.recommendationCategory, { color: theme.colors.primary }]}>
                  {item.category}
                </Text>
                
                <View style={styles.recommendationMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#FFB300" />
                    <Text style={[styles.rating, { color: theme.colors.onSurfaceVariant }]}>
                      {item.rating}
                    </Text>
                  </View>
                  <Text style={[styles.duration, { color: theme.colors.onSurfaceVariant }]}>
                    {item.duration}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={[styles.playButton, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="play" size={16} color={theme.colors.onPrimary} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[
          theme.colors.primaryContainer + '30',
          theme.colors.background,
        ]}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <View style={styles.headerContent}>
              <View style={styles.welcomeSection}>
                <Text style={[styles.greeting, { color: theme.colors.onSurfaceVariant }]}>
                  {getGreeting()} 🌅
                </Text>
                <Animated.Text style={[styles.userName, { color: theme.colors.onSurface }, welcomeAnimatedStyle]}>
                  {user?.name || 'Nature Lover'}
                </Animated.Text>
              </View>
              
              <TouchableOpacity style={[styles.profileButton, { backgroundColor: theme.colors.primaryContainer }]}>
                <Ionicons name="person" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            {/* Today's Stats */}
            <Animated.View 
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.statsContainer}
            >
              <Card variant="elevated" style={styles.statsCard}>
                <LinearGradient
                  colors={[
                    theme.colors.surface,
                    theme.colors.primaryContainer + '20',
                  ]}
                  style={styles.statsGradient}
                >
                  <Text style={[styles.statsTitle, { color: theme.colors.onSurface }]}>
                    Hành trình hôm nay 🌱
                  </Text>
                  
                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <Ionicons name="bed" size={20} color={theme.colors.secondary} />
                      <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                        {todayStats.sleepHours}h
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                        Giấc ngủ
                      </Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Ionicons name="flower" size={20} color={theme.colors.tertiary} />
                      <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                        {todayStats.meditationMinutes}m
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                        Thiền định
                      </Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Ionicons name="heart" size={20} color={theme.colors.primary} />
                      <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                        {todayStats.relaxationScore}%
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                        Thư giãn
                      </Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Ionicons name="flame" size={20} color="#FF6B35" />
                      <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                        {todayStats.currentStreak}
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                        Chuỗi ngày
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </Card>
            </Animated.View>
          </Animated.View>
          
          {/* Current Playing */}
          {currentTrack && (
            <Animated.View 
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.currentPlayingContainer}
            >
              <Card variant="filled" style={styles.currentPlayingCard}>
                <LinearGradient
                  colors={[
                    theme.colors.primary + '20',
                    theme.colors.tertiary + '15',
                  ]}
                  style={styles.currentPlayingGradient}
                >
                  <View style={styles.currentPlayingContent}>
                    <View style={styles.currentPlayingInfo}>
                      <Text style={[styles.nowPlayingLabel, { color: theme.colors.primary }]}>
                        🎵 Đang phát
                      </Text>
                      <Text style={[styles.currentTrackTitle, { color: theme.colors.onSurface }]}>
                        {currentTrack.title}
                      </Text>
                      <Text style={[styles.currentTrackArtist, { color: theme.colors.onSurfaceVariant }]}>
                        {currentTrack.artist}
                      </Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.playPauseButton, { backgroundColor: theme.colors.primary }]}
                    >
                      <Ionicons 
                        name={isPlaying ? 'pause' : 'play'} 
                        size={24} 
                        color={theme.colors.onPrimary} 
                      />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </Card>
            </Animated.View>
          )}
          
          {/* Quick Actions */}
          <View style={styles.sectionContainer}>
            <Animated.Text 
              entering={FadeInDown.delay(300).duration(600)}
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Khám phá thế giới thư giãn 🍃
            </Animated.Text>
            
            <FlatList
              data={quickActions}
              renderItem={renderQuickAction}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsContainer}
            />
          </View>
          
          {/* Recommendations */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Animated.Text 
                entering={FadeInDown.delay(500).duration(600)}
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Gợi ý cho bạn 🌟
              </Animated.Text>
              
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                  Xem tất cả
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={recommendations}
              renderItem={renderRecommendation}
              keyExtractor={(item) => item.id}
              style={styles.recommendationsList}
            />
          </View>
          
          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginBottom: 8,
  },
  statsCard: {
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  currentPlayingContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  currentPlayingCard: {
    overflow: 'hidden',
  },
  currentPlayingGradient: {
    padding: 16,
  },
  currentPlayingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPlayingInfo: {
    flex: 1,
  },
  nowPlayingLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentTrackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  currentTrackArtist: {
    fontSize: 14,
  },
  playPauseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsContainer: {
    paddingLeft: 0,
  },
  quickActionContainer: {
    marginRight: 16,
  },
  quickAction: {
    width: 140,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  recommendationsList: {
    marginTop: 0,
  },
  recommendationItem: {
    marginBottom: 12,
  },
  recommendationCard: {
    overflow: 'hidden',
  },
  recommendationGradient: {
    padding: 16,
  },
  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationThumbnail: {
    fontSize: 32,
    marginRight: 16,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationCategory: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
  },
  duration: {
    fontSize: 12,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default HomeScreen;