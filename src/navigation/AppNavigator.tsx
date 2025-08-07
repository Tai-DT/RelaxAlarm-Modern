/**
 * Main App Navigation Structure
 * Modern React Navigation 6 with Auth & Main Stacks
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AudiobooksScreen from '../screens/AudiobooksScreen';
import PodcastsScreen from '../screens/PodcastsScreen';
import AlarmsScreen from '../screens/AlarmsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import stores and types
import { useUserStore, useThemeStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';
import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Tab Bar Icon with Animation
interface TabIconProps {
  name: string;
  focused: boolean;
  color: string;
  size: number;
}

const AnimatedTabIcon: React.FC<TabIconProps> = ({ name, focused, color, size }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(focused ? 1.2 : 1);
    const translateY = withSpring(focused ? -2 : 0);
    
    return {
      transform: [{ scale }, { translateY }],
    };
  });
  
  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name as any} size={size} color={color} />
    </Animated.View>
  );
};

// Main Tab Navigator
const MainTabNavigator: React.FC = () => {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  const tabIcons = {
    Home: 'home',
    Audiobooks: 'library',
    Podcasts: 'radio',
    Alarms: 'alarm',
    Profile: 'person-circle',
  };
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => (
          <AnimatedTabIcon
            name={focused ? tabIcons[route.name as keyof typeof tabIcons] : tabIcons[route.name as keyof typeof tabIcons] + '-outline'}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline + '30',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 85,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[
              theme.colors.surface,
              theme.colors.surfaceContainer + '80',
            ]}
            style={StyleSheet.absoluteFillObject}
          />
        ),
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tab.Screen 
        name="Audiobooks" 
        component={AudiobooksScreen}
        options={{
          tabBarLabel: 'Âm thanh',
        }}
      />
      <Tab.Screen 
        name="Podcasts" 
        component={PodcastsScreen}
        options={{
          tabBarLabel: 'Podcast',
        }}
      />
      <Tab.Screen 
        name="Alarms" 
        component={AlarmsScreen}
        options={{
          tabBarLabel: 'Báo thức',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Hồ sơ',
        }}
      />
    </Tab.Navigator>
  );
};

// Root Stack Navigator
const AppNavigator: React.FC = () => {
  const { user } = useUserStore();
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  // For demo purposes, assume user is always logged in
  // In real app, check user authentication status
  const isAuthenticated = true; // user !== null;
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      {isAuthenticated ? (
        // Main App Stack
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabNavigator}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </>
      ) : (
        // Auth Stack
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            gestureEnabled: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;