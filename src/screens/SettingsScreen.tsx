/**
 * Advanced Settings Screen with Categories
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Import components
import { Header, Card, Button } from '../components/ui';

// Import stores and types
import { useSettingsStore, useThemeStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const settingsCategories = [
  {
    id: 'audio',
    title: 'Audio & Playback 🎵',
    icon: 'musical-notes-outline',
    settings: [
      {
        id: 'audio_quality',
        type: 'select',
        title: 'Audio Quality',
        subtitle: 'Higher quality uses more storage',
        options: ['Standard', 'High', 'Lossless'],
        value: 'High',
      },
      {
        id: 'auto_play',
        type: 'toggle',
        title: 'Auto-play Next',
        subtitle: 'Automatically play the next track',
        value: true,
      },
      {
        id: 'crossfade',
        type: 'slider',
        title: 'Crossfade Duration',
        subtitle: 'Smooth transitions between tracks',
        value: 3,
        min: 0,
        max: 10,
        unit: 'seconds',
      },
      {
        id: 'offline_mode',
        type: 'toggle',
        title: 'Offline Mode',
        subtitle: 'Prefer downloaded content',
        value: false,
      },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep & Relaxation 🌙',
    icon: 'bed-outline',
    settings: [
      {
        id: 'sleep_timer_default',
        type: 'select',
        title: 'Default Sleep Timer',
        subtitle: 'Automatic timer duration',
        options: ['15 min', '30 min', '45 min', '1 hour', '2 hours'],
        value: '45 min',
      },
      {
        id: 'fade_out_duration',
        type: 'slider',
        title: 'Fade Out Duration',
        subtitle: 'Gentle audio fade when timer ends',
        value: 30,
        min: 10,
        max: 120,
        unit: 'seconds',
      },
      {
        id: 'bedtime_reminders',
        type: 'toggle',
        title: 'Bedtime Reminders',
        subtitle: 'Gentle notifications for sleep routine',
        value: true,
      },
      {
        id: 'do_not_disturb',
        type: 'toggle',
        title: 'Auto Do Not Disturb',
        subtitle: 'Silence notifications during sleep',
        value: true,
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications 🔔',
    icon: 'notifications-outline',
    settings: [
      {
        id: 'push_notifications',
        type: 'toggle',
        title: 'Push Notifications',
        subtitle: 'General app notifications',
        value: true,
      },
      {
        id: 'meditation_reminders',
        type: 'toggle',
        title: 'Meditation Reminders',
        subtitle: 'Daily mindfulness suggestions',
        value: false,
      },
      {
        id: 'weekly_reports',
        type: 'toggle',
        title: 'Weekly Wellness Reports',
        subtitle: 'Summary of your relaxation journey',
        value: true,
      },
      {
        id: 'sound_on_notifications',
        type: 'toggle',
        title: 'Notification Sounds',
        subtitle: 'Play gentle sounds with notifications',
        value: false,
      },
    ],
  },
  {
    id: 'appearance',
    title: 'Appearance 🎨',
    icon: 'color-palette-outline',
    settings: [
      {
        id: 'theme_mode',
        type: 'select',
        title: 'Theme Mode',
        subtitle: 'Choose your preferred appearance',
        options: ['Light', 'Dark', 'Auto'],
        value: 'Auto',
      },
      {
        id: 'accent_color',
        type: 'select',
        title: 'Accent Color',
        subtitle: 'Customize the app color scheme',
        options: ['Forest Green', 'Ocean Blue', 'Sunset Orange', 'Lavender'],
        value: 'Forest Green',
      },
      {
        id: 'animations',
        type: 'toggle',
        title: 'Smooth Animations',
        subtitle: 'Enable beautiful transitions',
        value: true,
      },
      {
        id: 'reduce_motion',
        type: 'toggle',
        title: 'Reduce Motion',
        subtitle: 'Minimize animations for accessibility',
        value: false,
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Data 🔒',
    icon: 'shield-outline',
    settings: [
      {
        id: 'analytics',
        type: 'toggle',
        title: 'Usage Analytics',
        subtitle: 'Help improve the app with anonymous data',
        value: true,
      },
      {
        id: 'crash_reports',
        type: 'toggle',
        title: 'Crash Reports',
        subtitle: 'Automatically send crash information',
        value: true,
      },
      {
        id: 'personalized_ads',
        type: 'toggle',
        title: 'Personalized Ads',
        subtitle: 'Show relevant ads based on usage',
        value: false,
      },
      {
        id: 'data_saver',
        type: 'toggle',
        title: 'Data Saver Mode',
        subtitle: 'Reduce data usage for mobile networks',
        value: false,
      },
    ],
  },
];

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { settings, updateSetting, resetSettings } = useSettingsStore();
  const { isDark, toggleTheme } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  // State
  const [localSettings, setLocalSettings] = useState<Record<string, any>>(settings);
  
  // Animations
  const headerOpacity = useSharedValue(0);
  
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  const handleSettingChange = (settingId: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [settingId]: value }));
    updateSetting(settingId, value);
    
    // Handle special cases
    if (settingId === 'theme_mode') {
      if (value === 'Dark' && !isDark) {
        toggleTheme();
      } else if (value === 'Light' && isDark) {
        toggleTheme();
      }
    }
  };
  
  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will restore all settings to their default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetSettings();
            setLocalSettings(settings);
          },
        },
      ]
    );
  };
  
  const renderSettingItem = (setting: any) => {
    const currentValue = localSettings[setting.id] ?? setting.value;
    
    switch (setting.type) {
      case 'toggle':
        return (
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                {setting.title}
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {setting.subtitle}
              </Text>
            </View>
            <Switch
              value={currentValue}
              onValueChange={(value) => handleSettingChange(setting.id, value)}
              trackColor={{
                false: theme.colors.outline,
                true: theme.colors.primary + '60',
              }}
              thumbColor={currentValue ? theme.colors.primary : theme.colors.surface}
            />
          </View>
        );
        
      case 'select':
        return (
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              // Handle option selection
              Alert.alert(
                setting.title,
                'Select an option:',
                setting.options.map((option: string) => ({
                  text: option,
                  onPress: () => handleSettingChange(setting.id, option),
                }))
              );
            }}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                {setting.title}
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {setting.subtitle}
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: theme.colors.primary }]}>
                {currentValue}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.onSurfaceVariant} />
            </View>
          </TouchableOpacity>
        );
        
      case 'slider':
        return (
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                {setting.title}
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {setting.subtitle}
              </Text>
              
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={setting.min}
                  maximumValue={setting.max}
                  value={currentValue}
                  onValueChange={(value) => handleSettingChange(setting.id, Math.round(value))}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor={theme.colors.outline}
                  thumbStyle={{
                    backgroundColor: theme.colors.primary,
                    width: 20,
                    height: 20,
                  }}
                />
                <Text style={[styles.sliderValue, { color: theme.colors.primary }]}>
                  {currentValue} {setting.unit}
                </Text>
              </View>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  const renderCategory = (category: typeof settingsCategories[0], index: number) => (
    <Animated.View
      key={category.id}
      entering={FadeInDown.delay(200 + index * 100).duration(600)}
      style={styles.categoryContainer}
    >
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: theme.colors.primaryContainer }]}>
          <Ionicons name={category.icon as any} size={20} color={theme.colors.primary} />
        </View>
        <Text style={[styles.categoryTitle, { color: theme.colors.onSurface }]}>
          {category.title}
        </Text>
      </View>
      
      <Card variant="elevated" style={styles.categoryCard}>
        {category.settings.map((setting, settingIndex) => (
          <View key={setting.id}>
            {renderSettingItem(setting)}
            {settingIndex < category.settings.length - 1 && (
              <View style={[styles.settingDivider, { backgroundColor: theme.colors.outline }]} />
            )}
          </View>
        ))}
      </Card>
    </Animated.View>
  );
  
  const renderResetSection = () => (
    <Animated.View
      entering={FadeInDown.delay(800).duration(600)}
      style={styles.resetContainer}
    >
      <Card variant="elevated" style={styles.resetCard}>
        <LinearGradient
          colors={[
            theme.colors.errorContainer + '40',
            'transparent',
          ]}
          style={styles.resetGradient}
        >
          <View style={styles.resetContent}>
            <View style={[styles.resetIcon, { backgroundColor: theme.colors.errorContainer }]}>
              <Ionicons name="refresh-outline" size={24} color={theme.colors.error} />
            </View>
            
            <View style={styles.resetText}>
              <Text style={[styles.resetTitle, { color: theme.colors.onSurface }]}>
                Reset All Settings
              </Text>
              <Text style={[styles.resetSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Restore default app settings and preferences
              </Text>
            </View>
            
            <Button
              variant="outlined"
              color="error"
              size="small"
              onPress={handleResetSettings}
            >
              Reset
            </Button>
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Settings ⚙️"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            Customize Your Experience 🌱
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Personalize RelaxAlarm to match your wellness journey
          </Text>
        </Animated.View>
        
        {settingsCategories.map((category, index) => renderCategory(category, index))}
        
        {renderResetSection()}
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
    paddingBottom: 120,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  categoryContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoryCard: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingDivider: {
    height: 1,
    marginLeft: 16,
    opacity: 0.3,
  },
  sliderContainer: {
    marginTop: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: -8,
  },
  resetContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  resetCard: {
    overflow: 'hidden',
  },
  resetGradient: {
    padding: 16,
  },
  resetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resetText: {
    flex: 1,
    marginRight: 16,
  },
  resetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  resetSubtitle: {
    fontSize: 14,
  },
});

export default SettingsScreen;