/**
 * Modern Profile Screen with Settings & Stats
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
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
import { useUserStore, useThemeStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';
import { MainTabParamList } from '../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

// Sample stats data
const statsData = [
  {
    id: '1',
    icon: 'bed-outline',
    label: 'Sleep Sessions',
    value: '127',
    unit: 'nights',
    color: '#2D5C42',
    trend: '+12%',
  },
  {
    id: '2',
    icon: 'time-outline',
    label: 'Meditation Time',
    value: '45.2',
    unit: 'hours',
    color: '#7A8471',
    trend: '+8%',
  },
  {
    id: '3',
    icon: 'heart-outline',
    label: 'Relaxation Score',
    value: '8.7',
    unit: '/10',
    color: '#6B7EA6',
    trend: '+0.5',
  },
  {
    id: '4',
    icon: 'flame-outline',
    label: 'Daily Streak',
    value: '23',
    unit: 'days',
    color: '#B17F4A',
    trend: 'active',
  },
];

const settingsOptions = [
  {
    id: '1',
    category: 'Preferences',
    items: [
      {
        id: 'notifications',
        icon: 'notifications-outline',
        title: 'Push Notifications',
        subtitle: 'Gentle reminders for relaxation',
        type: 'toggle',
        value: true,
      },
      {
        id: 'dark_mode',
        icon: 'moon-outline',
        title: 'Dark Mode',
        subtitle: 'Easier on the eyes for evening use',
        type: 'toggle',
        value: false,
      },
      {
        id: 'auto_sleep',
        icon: 'bed-outline',
        title: 'Auto Sleep Mode',
        subtitle: 'Automatically activate during bedtime',
        type: 'toggle',
        value: true,
      },
    ],
  },
  {
    id: '2',
    category: 'Content',
    items: [
      {
        id: 'download_quality',
        icon: 'download-outline',
        title: 'Download Quality',
        subtitle: 'High quality audio for offline use',
        type: 'navigation',
        value: 'High',
      },
      {
        id: 'premium',
        icon: 'leaf-outline',
        title: 'Premium Features',
        subtitle: 'Unlock all nature sounds & meditations',
        type: 'navigation',
        isPremium: true,
      },
    ],
  },
  {
    id: '3',
    category: 'Account',
    items: [
      {
        id: 'backup',
        icon: 'cloud-outline',
        title: 'Backup & Sync',
        subtitle: 'Keep your data safe across devices',
        type: 'navigation',
      },
      {
        id: 'privacy',
        icon: 'shield-outline',
        title: 'Privacy Settings',
        subtitle: 'Control your data and privacy',
        type: 'navigation',
      },
      {
        id: 'help',
        icon: 'help-circle-outline',
        title: 'Help & Support',
        subtitle: 'Get help with RelaxAlarm',
        type: 'navigation',
      },
    ],
  },
];

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, updateProfile, logout } = useUserStore();
  const { isDark, toggleTheme } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  // State
  const [settings, setSettings] = useState<Record<string, boolean>>({
    notifications: true,
    dark_mode: isDark,
    auto_sleep: true,
  });
  
  // Animations
  const headerOpacity = useSharedValue(0);
  
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  const handleSettingToggle = (settingId: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [settingId]: value }));
    
    if (settingId === 'dark_mode') {
      toggleTheme();
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };
  
  const renderProfileHeader = () => (
    <Animated.View style={[styles.profileHeader, headerAnimatedStyle]}>
      <LinearGradient
        colors={[
          theme.colors.primaryContainer + '80',
          theme.colors.tertiaryContainer + '60',
          theme.colors.secondaryContainer + '40',
        ]}
        style={styles.headerGradient}
      >
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={() => {
            // Handle profile picture change
          }}
        >
          <Image
            source={{
              uri: user?.profilePicture || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={[styles.editBadge, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="camera" size={12} color={theme.colors.onPrimary} />
          </View>
        </TouchableOpacity>
        
        <Text style={[styles.userName, { color: theme.colors.onSurface }]}>
          {user?.name || 'Nature Lover'} 🌿
        </Text>
        
        <Text style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>
          {user?.email || 'peaceful@relaxalarm.com'}
        </Text>
        
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: theme.colors.tertiary }]}>
            <Ionicons name="leaf" size={14} color={theme.colors.onTertiary} />
            <Text style={[styles.badgeText, { color: theme.colors.onTertiary }]}>
              Mindful Explorer
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
  
  const renderStats = () => (
    <Animated.View 
      style={styles.statsContainer}
      entering={FadeInDown.delay(200).duration(600)}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Your Wellness Journey 🌱
      </Text>
      
      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <Animated.View
            key={stat.id}
            entering={FadeInDown.delay(300 + index * 100).duration(600)}
            style={styles.statCard}
          >
            <Card variant="elevated" style={styles.statCardInner}>
              <LinearGradient
                colors={[
                  stat.color + '20',
                  'transparent',
                ]}
                style={styles.statGradient}
              >
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                
                <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                  {stat.value}
                  <Text style={[styles.statUnit, { color: theme.colors.onSurfaceVariant }]}>
                    {stat.unit}
                  </Text>
                </Text>
                
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  {stat.label}
                </Text>
                
                <View style={[styles.trendBadge, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.trendText, { color: theme.colors.primary }]}>
                    {stat.trend}
                  </Text>
                </View>
              </LinearGradient>
            </Card>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
  
  const renderSettingsSection = (section: typeof settingsOptions[0], index: number) => (
    <Animated.View
      key={section.id}
      entering={FadeInDown.delay(500 + index * 200).duration(600)}
      style={styles.settingsSection}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        {section.category}
      </Text>
      
      <Card variant="elevated" style={styles.settingsCard}>
        {section.items.map((item, itemIndex) => (
          <View key={item.id}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => {
                if (item.type === 'navigation') {
                  // Handle navigation
                } else if (item.type === 'toggle') {
                  handleSettingToggle(item.id, !settings[item.id]);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Ionicons name={item.icon as any} size={20} color={theme.colors.primary} />
                </View>
                
                <View style={styles.settingText}>
                  <View style={styles.settingHeader}>
                    <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                      {item.title}
                    </Text>
                    {item.isPremium && (
                      <View style={[styles.premiumBadge, { backgroundColor: theme.colors.tertiary }]}>
                        <Ionicons name="leaf" size={10} color={theme.colors.onTertiary} />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.settingSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              
              <View style={styles.settingRight}>
                {item.type === 'toggle' ? (
                  <Switch
                    value={settings[item.id]}
                    onValueChange={(value) => handleSettingToggle(item.id, value)}
                    trackColor={{
                      false: theme.colors.outline,
                      true: theme.colors.primary + '60',
                    }}
                    thumbColor={settings[item.id] ? theme.colors.primary : theme.colors.surface}
                  />
                ) : (
                  <View style={styles.navigationRight}>
                    {item.value && (
                      <Text style={[styles.settingValue, { color: theme.colors.onSurfaceVariant }]}>
                        {item.value}
                      </Text>
                    )}
                    <Ionicons name="chevron-forward" size={16} color={theme.colors.onSurfaceVariant} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            
            {itemIndex < section.items.length - 1 && (
              <View style={[styles.settingDivider, { backgroundColor: theme.colors.outline }]} />
            )}
          </View>
        ))}
      </Card>
    </Animated.View>
  );
  
  const renderSignOutButton = () => (
    <Animated.View
      entering={FadeInDown.delay(1000).duration(600)}
      style={styles.signOutContainer}
    >
      <Button
        variant="outlined"
        color="error"
        icon="log-out-outline"
        onPress={handleLogout}
        style={styles.signOutButton}
      >
        Sign Out
      </Button>
    </Animated.View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Profile 🧘‍♀️"
        rightIcon="create-outline"
        onRightPress={() => {
          // Navigate to edit profile
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileHeader()}
        {renderStats()}
        
        {settingsOptions.map((section, index) => renderSettingsSection(section, index))}
        
        {renderSignOutButton()}
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.onSurfaceVariant }]}>
            RelaxAlarm Modern v1.0.0 🌿
          </Text>
        </View>
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
  profileHeader: {
    marginBottom: 24,
  },
  headerGradient: {
    padding: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
  },
  statCardInner: {
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
  },
  settingsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  settingsCard: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  premiumBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  settingRight: {
    marginLeft: 12,
  },
  navigationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  settingDivider: {
    height: 1,
    marginLeft: 68,
    opacity: 0.3,
  },
  signOutContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  signOutButton: {
    // Button styles handled by component
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
  },
});

export default ProfileScreen;