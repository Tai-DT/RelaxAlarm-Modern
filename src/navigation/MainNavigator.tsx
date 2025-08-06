/**
 * Modern Navigation Structure with React Navigation 6
 */

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import AudiobooksScreen from '../screens/AudiobooksScreen';
import PodcastsScreen from '../screens/PodcastsScreen';
import SleepScreen from '../screens/SleepScreen';
import AlarmsScreen from '../screens/AlarmsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import AudiobookPlayerScreen from '../screens/AudiobookPlayerScreen';
import PodcastPlayerScreen from '../screens/PodcastPlayerScreen';
import AlarmSettingsScreen from '../screens/AlarmSettingsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import stores
import { useAuthStore, useThemeStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';
import { RootStackParamList, MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Custom Navigation Themes
const createNavigationTheme = (isDark: boolean) => {
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  return {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outlineVariant,
      notification: theme.colors.tertiary,
    },
  };
};

// Tab Navigator
const TabNavigator: React.FC = () => {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Audiobooks':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Podcasts':
              iconName = focused ? 'radio' : 'radio-outline';
              break;
            case 'Sleep':
              iconName = focused ? 'moon' : 'moon-outline';
              break;
            case 'Alarms':
              iconName = focused ? 'alarm' : 'alarm-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          ...theme.elevation.level2,
        },
        tabBarLabelStyle: {
          ...theme.typography.labelSmall,
          marginTop: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Audiobooks" 
        component={AudiobooksScreen}
        options={{ tabBarLabel: 'Audiobooks' }}
      />
      <Tab.Screen 
        name="Podcasts" 
        component={PodcastsScreen}
        options={{ tabBarLabel: 'Podcasts' }}
      />
      <Tab.Screen 
        name="Sleep" 
        component={SleepScreen}
        options={{ tabBarLabel: 'Sleep' }}
      />
      <Tab.Screen 
        name="Alarms" 
        component={AlarmsScreen}
        options={{ tabBarLabel: 'Alarms' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Auth Navigator
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main Navigator
const MainNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { isDark } = useThemeStore();
  const navigationTheme = createNavigationTheme(isDark);

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {isAuthenticated ? (
          // Authenticated Stack
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            
            {/* Modal Screens */}
            <Stack.Screen 
              name="Subscription" 
              component={SubscriptionScreen}
              options={{ 
                presentation: 'modal',
                gestureEnabled: true,
              }}
            />
            
            {/* Player Screens */}
            <Stack.Screen 
              name="AudiobookPlayer" 
              component={AudiobookPlayerScreen}
              options={{ 
                presentation: 'card',
                gestureEnabled: true,
              }}
            />
            
            <Stack.Screen 
              name="PodcastPlayer" 
              component={PodcastPlayerScreen}
              options={{ 
                presentation: 'card',
                gestureEnabled: true,
              }}
            />
            
            {/* Settings Screens */}
            <Stack.Screen 
              name="AlarmSettings" 
              component={AlarmSettingsScreen}
              options={{ 
                presentation: 'card',
                gestureEnabled: true,
              }}
            />
            
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ 
                presentation: 'card',
                gestureEnabled: true,
              }}
            />
          </>
        ) : (
          // Authentication Stack
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;