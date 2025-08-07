/**
 * RelaxAlarm Modern - Main App Component
 * Modern, Dynamic Interface with Natural Theme
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Import navigation
import AppNavigator from './src/navigation/AppNavigator';

// Import theme and stores
import { lightAppTheme, darkAppTheme } from './src/constants/theme';
import { useThemeStore } from './src/stores/themeStore';
import { useUserStore } from './src/stores/userStore';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { isDark } = useThemeStore();
  const { initializeUser } = useUserStore();
  
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  // Animation values
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const splashOpacity = useSharedValue(1);
  
  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
        });
        
        // Initialize stores
        await initializeUser();
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setAppIsReady(true);
        
        // Start splash animation
        logoOpacity.value = withTiming(1, { duration: 800 });
        logoScale.value = withTiming(1, { duration: 800 });
        
        // Hide splash after animation
        setTimeout(() => {
          splashOpacity.value = withTiming(0, { duration: 600 }, () => {
            runOnJS(setShowSplash)(false);
            runOnJS(SplashScreen.hideAsync)();
          });
        }, 1500);
        
      } catch (e) {
        console.warn(e);
        setAppIsReady(true);
        setShowSplash(false);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);
  
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  
  const splashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));
  
  const renderSplashScreen = () => (
    <Animated.View style={[styles.splashContainer, splashAnimatedStyle]}>
      <LinearGradient
        colors={[
          theme.colors.primaryContainer + '80',
          theme.colors.tertiaryContainer + '60',
          theme.colors.secondaryContainer + '40',
        ]}
        style={styles.splashGradient}
      >
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={[styles.logoIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="leaf" size={48} color={theme.colors.onPrimary} />
          </View>
          
          <Text style={[styles.appName, { color: theme.colors.onSurface }]}>
            RelaxAlarm
          </Text>
          
          <Text style={[styles.appTagline, { color: theme.colors.onSurfaceVariant }]}>
            Natural Sleep & Relaxation Companion 🌿
          </Text>
          
          <View style={styles.loadingContainer}>
            <View style={[styles.loadingBar, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Animated.View 
                style={[
                  styles.loadingProgress,
                  { backgroundColor: theme.colors.primary }
                ]}
              />
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
  
  if (!appIsReady || showSplash) {
    return renderSplashScreen();
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar 
            style={isDark ? 'light' : 'dark'} 
            backgroundColor={theme.colors.surface}
          />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  splashGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 22,
  },
  loadingContainer: {
    width: 200,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    width: '70%',
    borderRadius: 2,
  },
});

export default App;