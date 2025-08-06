/**
 * Main App Component with Modern Architecture
 */

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import navigation
import MainNavigator from './src/navigation/MainNavigator';

// Import stores
import { useAuthStore, useThemeStore, usePlayerStore } from './src/stores';
import { lightAppTheme, darkAppTheme } from './src/constants/theme';

// Import error boundary
import ErrorBoundary from './src/components/ErrorBoundary';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [isReady, setIsReady] = React.useState(false);
  const { initializeAuth, isInitialized: authInitialized } = useAuthStore();
  const { isDark, initializeTheme } = useThemeStore();
  const { initializePlayer } = usePlayerStore();
  
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  useEffect(() => {
    prepareApp();
  }, []);
  
  const prepareApp = async () => {
    try {
      // Load custom fonts if needed
      await Font.loadAsync({
        ...Ionicons.font,
        // Add custom fonts here
        // 'CustomFont-Regular': require('./assets/fonts/CustomFont-Regular.ttf'),
        // 'CustomFont-Bold': require('./assets/fonts/CustomFont-Bold.ttf'),
      });
      
      // Initialize stores
      await Promise.all([
        initializeAuth(),
        initializeTheme(),
        initializePlayer(),
      ]);
      
      // Simulate minimum loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('App initialization error:', error);
      // Handle initialization errors gracefully
    } finally {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  };
  
  if (!isReady || !authInitialized) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        
        {/* Custom Loading Screen */}
        <View style={styles.loadingContent}>
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.logoText, { color: theme.colors.onPrimary }]}>
              🌙
            </Text>
          </View>
          
          <Text style={[styles.appName, { color: theme.colors.onSurface }]}>
            RelaxAlarm
          </Text>
          
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            Preparing your relaxation experience...
          </Text>
          
          <ActivityIndicator 
            size="large" 
            color={theme.colors.primary} 
            style={styles.loader}
          />
        </View>
      </View>
    );
  }
  
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <MainNavigator />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
});

export default App;