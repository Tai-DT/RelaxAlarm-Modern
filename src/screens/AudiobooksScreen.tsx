/**
 * Updated Audiobooks Screen with Natural Color Palette
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
import { Audiobook, MainTabParamList } from '../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type AudiobooksScreenProps = BottomTabScreenProps<MainTabParamList, 'Audiobooks'>;

const { width } = Dimensions.get('window');

// Updated sample data with nature/relaxation themes
const sampleAudiobooks: Audiobook[] = [
  {
    id: '1',
    title: 'Forest Meditation',
    author: 'Nature Sounds Collection',
    description: 'Immerse yourself in the peaceful sounds of ancient forests.',
    duration: 2.5,
    url: 'https://example.com/forest-meditation.mp3',
    coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
    category: 'Nature',
    rating: 4.8,
    releaseDate: '2024-01-15',
    isSubscriptionRequired: false,
    language: 'English',
    narrator: 'Sarah Williams',
    chapters: [
      { id: '1', title: 'Morning Forest', startTime: 0, duration: 30 },
      { id: '2', title: 'Deep Woods', startTime: 30, duration: 45 },
    ],
  },
  {
    id: '2',
    title: 'Ocean Waves Sleep',
    author: 'Calm Waters Audio',
    description: 'Gentle ocean waves to guide you into peaceful sleep.',
    duration: 8.0,
    url: 'https://example.com/ocean-waves.mp3',
    coverImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=300&fit=crop',
    category: 'Sleep',
    rating: 4.9,
    releaseDate: '2024-02-01',
    isSubscriptionRequired: true,
    language: 'English',
    narrator: 'Michael Chen',
    chapters: [
      { id: '1', title: 'Gentle Waves', startTime: 0, duration: 120 },
      { id: '2', title: 'Deep Ocean', startTime: 120, duration: 360 },
    ],
  },
  {
    id: '3',
    title: 'Mountain Zen',
    author: 'Peaceful Minds',
    description: 'High altitude tranquility and mountain serenity.',
    duration: 4.5,
    url: 'https://example.com/mountain-zen.mp3',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    category: 'Meditation',
    rating: 4.7,
    releaseDate: '2024-01-20',
    isSubscriptionRequired: false,
    language: 'English',
    narrator: 'Emma Thompson',
    chapters: [
      { id: '1', title: 'Mountain Air', startTime: 0, duration: 90 },
      { id: '2', title: 'Summit Peace', startTime: 90, duration: 180 },
    ],
  },
];

const categories = ['All', 'Nature', 'Sleep', 'Meditation', 'Relaxation', 'Healing'];

const AudiobooksScreen: React.FC<AudiobooksScreenProps> = ({ navigation }) => {
  const { playContent, currentContent } = usePlayerStore();
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>(sampleAudiobooks);
  
  // Animations
  const headerOpacity = useSharedValue(0);
  
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  // Filter audiobooks
  const filteredAudiobooks = audiobooks.filter(audiobook => {
    const matchesSearch = audiobook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         audiobook.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || audiobook.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handlePlayAudiobook = (audiobook: Audiobook) => {
    playContent(audiobook);
    navigation.navigate('AudiobookPlayer', { audiobook });
  };
  
  const renderSearch = () => (
    <Animated.View style={[styles.searchContainer, headerAnimatedStyle]}>
      <TextField
        placeholder="Search peaceful content..."
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
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === category 
                  ? theme.colors.primary 
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
                    ? theme.colors.onPrimary 
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
  
  const renderAudiobookCard = ({ item, index }: { item: Audiobook; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      layout={Layout.springify()}
    >
      <Card
        variant="elevated"
        style={[styles.audiobookCard, { backgroundColor: theme.colors.surfaceContainer }]}
        onPress={() => handlePlayAudiobook(item)}
      >
        <LinearGradient
          colors={[
            theme.colors.surfaceContainer,
            theme.colors.surfaceContainer + '90',
          ]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <Image
              source={{ uri: item.coverImage }}
              style={styles.coverImage}
              resizeMode="cover"
            />
            
            <View style={styles.bookInfo}>
              <View style={styles.bookHeader}>
                <Text style={[styles.bookTitle, { color: theme.colors.onSurface }]} numberOfLines={2}>
                  {item.title}
                </Text>
                
                {item.isSubscriptionRequired && (
                  <View style={[styles.premiumBadge, { backgroundColor: theme.colors.tertiary }]}>
                    <Ionicons name="leaf" size={12} color={theme.colors.onTertiary} />
                  </View>
                )}
              </View>
              
              <Text style={[styles.bookAuthor, { color: theme.colors.primary }]} numberOfLines={1}>
                {item.author}
              </Text>
              
              <Text style={[styles.bookDescription, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                {item.description}
              </Text>
              
              <View style={styles.bookMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time" size={14} color={theme.colors.primary} />
                  <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                    {item.duration}h
                  </Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={14} color={theme.colors.tertiary} />
                  <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                    {item.rating}
                  </Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Ionicons name="leaf" size={14} color={theme.colors.secondary} />
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
                    : theme.colors.primary 
                },
              ]}
              onPress={() => handlePlayAudiobook(item)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={currentContent?.id === item.id ? 'pause' : 'play'}
                size={20}
                color={theme.colors.onPrimary}
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
        <Ionicons name="leaf-outline" size={48} color={theme.colors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
        No content found
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Try adjusting your search or explore different categories
      </Text>
    </Animated.View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Nature Sounds 🌿"
        rightIcon="heart-outline"
        onRightPress={() => {
          // Navigate to favorites
        }}
      />
      
      {renderSearch()}
      {renderCategories()}
      
      <FlatList
        data={filteredAudiobooks}
        renderItem={renderAudiobookCard}
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
  audiobookCard: {
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
  bookInfo: {
    flex: 1,
    marginRight: 12,
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bookTitle: {
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
  bookAuthor: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  bookDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  bookMeta: {
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

export default AudiobooksScreen;