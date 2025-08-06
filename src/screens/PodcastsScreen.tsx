/**
 * Modern Podcasts Screen with Categories & Player
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Layout,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Import components
import { Header, Card, Button, TextField } from '../components/ui';

// Import stores and types
import { usePlayerStore, useThemeStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';
import { Podcast, MainTabParamList } from '../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type PodcastsScreenProps = BottomTabScreenProps<MainTabParamList, 'Podcasts'>;

const { width } = Dimensions.get('window');

// Sample peaceful podcasts data
const samplePodcasts: Podcast[] = [
  {
    id: '1',
    title: 'Mindful Morning',
    author: 'Zen Podcast Network',
    description: 'Start your day with gentle mindfulness and peaceful thoughts.',
    duration: 25,
    url: 'https://example.com/mindful-morning.mp3',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    category: 'Mindfulness',
    rating: 4.9,
    releaseDate: '2024-08-01',
    isSubscriptionRequired: false,
    language: 'English',
    episodeCount: 52,
    isCompleted: false,
    tags: ['morning', 'meditation', 'mindfulness'],
    episodes: [
      {
        id: 'ep1',
        title: 'Welcome to Mindful Morning',
        description: 'Introduction to morning mindfulness practice',
        duration: 15,
        url: 'https://example.com/ep1.mp3',
        publishDate: '2024-08-01',
        episodeNumber: 1,
      },
    ],
  },
  {
    id: '2',
    title: 'Sleep Stories',
    author: 'Peaceful Dreams',
    description: 'Calming bedtime stories to ease you into restful sleep.',
    duration: 45,
    url: 'https://example.com/sleep-stories.mp3',
    coverImage: 'https://images.unsplash.com/photo-1517147177326-b37599372b73?w=300&h=300&fit=crop',
    category: 'Sleep',
    rating: 4.8,
    releaseDate: '2024-07-15',
    isSubscriptionRequired: true,
    language: 'English',
    episodeCount: 100,
    isCompleted: false,
    tags: ['sleep', 'stories', 'relaxation'],
    episodes: [
      {
        id: 'ep1',
        title: 'The Enchanted Forest',
        description: 'A peaceful journey through magical woods',
        duration: 30,
        url: 'https://example.com/forest-story.mp3',
        publishDate: '2024-07-15',
        episodeNumber: 1,
      },
    ],
  },
  {
    id: '3',
    title: 'Nature Healing',
    author: 'Earth Sounds Collective',
    description: 'Therapeutic nature sounds for deep relaxation and healing.',
    duration: 60,
    url: 'https://example.com/nature-healing.mp3',
    coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
    category: 'Healing',
    rating: 4.7,
    releaseDate: '2024-06-20',
    isSubscriptionRequired: false,
    language: 'English',
    episodeCount: 24,
    isCompleted: false,
    tags: ['nature', 'healing', 'therapy'],
    episodes: [
      {
        id: 'ep1',
        title: 'Forest Therapy Session',
        description: 'Immersive forest sounds for healing',
        duration: 60,
        url: 'https://example.com/forest-therapy.mp3',
        publishDate: '2024-06-20',
        episodeNumber: 1,
      },
    ],
  },
];

const categories = ['All', 'Mindfulness', 'Sleep', 'Healing', 'Meditation', 'Stories'];

const PodcastsScreen: React.FC<PodcastsScreenProps> = ({ navigation }) => {
  const { playContent, currentContent } = usePlayerStore();
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [podcasts, setPodcasts] = useState<Podcast[]>(samplePodcasts);
  
  // Animations
  const headerOpacity = useSharedValue(0);
  
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  // Filter podcasts
  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         podcast.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || podcast.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handlePlayPodcast = (podcast: Podcast) => {
    playContent(podcast);
    navigation.navigate('PodcastPlayer', { podcast });
  };
  
  const renderSearch = () => (
    <Animated.View style={[styles.searchContainer, headerAnimatedStyle]}>
      <TextField
        placeholder="Search peaceful podcasts..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon="search"
        clearButtonMode="while-editing"
        style={styles.searchInput}
      />
    </Animated.View>
  );
  
  const renderCategories = () => (
    <Animated.View 
      style={styles.categoriesContainer}
      entering={FadeInDown.delay(200).duration(600)}
    >
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === category 
                  ? theme.colors.secondary 
                  : theme.colors.surfaceVariant,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === category 
                    ? theme.colors.onSecondary 
                    : theme.colors.onSurfaceVariant,
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
  
  const renderPodcastCard = ({ item, index }: { item: Podcast; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      layout={Layout.springify()}
    >
      <Card
        variant="elevated"
        style={[styles.podcastCard, { backgroundColor: theme.colors.surfaceContainer }]}
        onPress={() => handlePlayPodcast(item)}
      >
        <LinearGradient
          colors={[
            theme.colors.secondaryContainer + '40',
            theme.colors.surfaceContainer,
          ]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <Image
              source={{ uri: item.coverImage }}
              style={styles.coverImage}
              resizeMode="cover"
            />
            
            <View style={styles.podcastInfo}>
              <View style={styles.podcastHeader}>
                <Text style={[styles.podcastTitle, { color: theme.colors.onSurface }]} numberOfLines={2}>
                  {item.title}
                </Text>
                
                {item.isSubscriptionRequired && (
                  <View style={[styles.premiumBadge, { backgroundColor: theme.colors.tertiary }]}>
                    <Ionicons name="leaf" size={12} color={theme.colors.onTertiary} />
                  </View>
                )}
              </View>
              
              <Text style={[styles.podcastAuthor, { color: theme.colors.secondary }]} numberOfLines={1}>
                {item.author}
              </Text>
              
              <Text style={[styles.podcastDescription, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                {item.description}
              </Text>
              
              <View style={styles.podcastMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="radio" size={14} color={theme.colors.secondary} />
                  <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                    {item.episodeCount} episodes
                  </Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={14} color={theme.colors.tertiary} />
                  <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                    {item.rating}
                  </Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Ionicons name="heart" size={14} color={theme.colors.primary} />
                  <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                    {item.category}
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={[
                styles.playButton,
                { 
                  backgroundColor: currentContent?.id === item.id 
                    ? theme.colors.tertiary 
                    : theme.colors.secondary 
                },
              ]}
              onPress={() => handlePlayPodcast(item)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={currentContent?.id === item.id ? 'pause' : 'play'}
                size={20}
                color={theme.colors.onSecondary}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );
  
  const renderEmptyState = () => (
    <Animated.View 
      style={styles.emptyContainer}
      entering={FadeInDown.delay(400).duration(600)}
    >
      <View style={[styles.emptyIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Ionicons name="radio-outline" size={48} color={theme.colors.secondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
        No podcasts found
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Try exploring different categories or adjusting your search
      </Text>
    </Animated.View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Peaceful Podcasts 🎙️"
        rightIcon="bookmark-outline"
        onRightPress={() => {
          // Navigate to saved podcasts
        }}
      />
      
      {renderSearch()}
      {renderCategories()}
      
      <FlatList
        data={filteredPodcasts}
        renderItem={renderPodcastCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchInput: {
    // TextField styles handled by component
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  podcastCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  coverImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  podcastInfo: {
    flex: 1,
    marginRight: 12,
  },
  podcastHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  podcastTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  premiumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  podcastAuthor: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  podcastDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  podcastMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default PodcastsScreen;