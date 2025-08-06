/**
 * Updated Home Screen with Natural Color Palette
 */

import React, { useEffect } from 'react';
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
} from 'react-native-reanimated';

// Import components
import { Header, Card, Button } from '../components/ui';

// Import stores and types
import { useAuthStore, usePlayerStore, useSleepStore, useThemeStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';
import { MainTabParamList } from '../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { currentContent, isPlaying } = usePlayerStore();
  const { getSleepStats } = useSleepStore();
  const { isDark } = useThemeStore();
  
  const theme = isDark ? darkAppTheme : lightAppTheme;
  const sleepStats = getSleepStats();
  
  // Animations
  const headerOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const statsOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Animate elements on mount
    headerOpacity.value = withTiming(1, { duration: 600 });
    cardTranslateY.value = withDelay(200, withTiming(0, { duration: 600 }));
    statsOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
    opacity: cardTranslateY.value === 0 ? 1 : 0,
  }));
  
  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };
  
  const renderWelcomeSection = () => (
    <LinearGradient
      colors={[
        theme.colors.primaryContainer + '60',
        theme.colors.tertiaryContainer + '40',
        'transparent'
      ]}
      style={styles.welcomeContainer}
    >
      <Animated.View style={[styles.welcomeContent, headerAnimatedStyle]}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: theme.colors.onSurface }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.userName, { color: theme.colors.primary }]}>
            {user?.name || 'User'}! 🌿
          </Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
  
  const renderQuickStats = () => (
    <Animated.View style={[styles.statsContainer, statsAnimatedStyle]}>
      <Card variant="elevated" padding="md" style={styles.statsCard}>
        <Text style={[styles.statsTitle, { color: theme.colors.onSurface }]}>
          Today's Relaxation
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="moon" size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {Math.round(sleepStats.averageDuration || 0)}h
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Sleep
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Ionicons name="musical-notes" size={24} color={theme.colors.secondary} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {currentContent ? '1' : '0'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Playing
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.tertiaryContainer }]}>
              <Ionicons name="leaf" size={24} color={theme.colors.tertiary} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {Math.round(sleepStats.averageQuality || 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Quality
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
  
  const renderCurrentlyPlaying = () => {
    if (!currentContent) return null;
    
    return (
      <Animated.View style={cardAnimatedStyle}>
        <Card 
          variant="filled" 
          padding="md" 
          style={[styles.playingCard, { backgroundColor: theme.colors.surfaceContainer }]}
          onPress={() => {
            // Navigate to player
            if (currentContent.type === 'audiobook') {
              navigation.navigate('AudiobookPlayer', { audiobook: currentContent as any });
            } else {
              navigation.navigate('PodcastPlayer', { podcast: currentContent as any });
            }
          }}
        >
          <View style={styles.playingHeader}>
            <View style={styles.playingInfo}>
              <Text style={[styles.playingLabel, { color: theme.colors.primary }]}>
                Now Playing 🎵
              </Text>
              <Text style={[styles.playingTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                {currentContent.title}
              </Text>
              <Text style={[styles.playingArtist, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                {currentContent.author}
              </Text>
            </View>
            
            <View style={[styles.playingIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'} 
                size={24} 
                color={theme.colors.onPrimary} 
              />
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };
  
  const renderQuickActions = () => (
    <Animated.View style={cardAnimatedStyle}>
      <Card variant="outlined" padding="md" style={styles.actionsCard}>
        <Text style={[styles.actionsTitle, { color: theme.colors.onSurface }]}>
          Explore Relaxation 🧘‍♀️
        </Text>
        
        <View style={styles.actionsGrid}>
          <Button
            variant="filled"
            color="primary"
            icon="book"
            onPress={() => navigation.navigate('Audiobooks')}
            style={styles.actionButton}
          >
            Audiobooks
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            icon="radio"
            onPress={() => navigation.navigate('Podcasts')}
            style={styles.actionButton}
          >
            Podcasts
          </Button>
          
          <Button
            variant="text"
            color="primary"
            icon="moon"
            onPress={() => navigation.navigate('Sleep')}
            style={styles.actionButton}
          >
            Sleep Tracker
          </Button>
          
          <Button
            variant="text"
            color="tertiary"
            icon="alarm"
            onPress={() => navigation.navigate('Alarms')}
            style={styles.actionButton}
          >
            Gentle Alarms
          </Button>
        </View>
      </Card>
    </Animated.View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="RelaxAlarm 🌙"
        rightIcon="settings"
        onRightPress={() => navigation.navigate('Settings')}
        transparent
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderWelcomeSection()}
        {renderQuickStats()}
        {renderCurrentlyPlaying()}
        {renderQuickActions()}
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
  welcomeContainer: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '400',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  dateContainer: {
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    fontWeight: '400',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsCard: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
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
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  playingCard: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  playingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playingInfo: {
    flex: 1,
  },
  playingLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  playingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  playingArtist: {
    fontSize: 14,
    marginTop: 2,
  },
  playingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default HomeScreen;