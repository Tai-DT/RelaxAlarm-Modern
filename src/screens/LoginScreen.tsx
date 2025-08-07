/**
 * Modern Login Screen with Natural Forest Theme
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import components and stores
import { Button, TextField, Card } from '../components/ui';
import { useUserStore, useThemeStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';

const LoginScreen: React.FC = () => {
  const { login } = useUserStore();
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  // Form state
  const [email, setEmail] = useState('demo@relaxalarm.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const logoScale = useSharedValue(0.8);
  const logoRotation = useSharedValue(-5);
  const contentOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Start animations
    logoScale.value = withSpring(1, { damping: 15 });
    logoRotation.value = withSpring(0, { damping: 20 });
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
  }, []);
  
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotation.value}deg` },
    ],
  }));
  
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock login success
      await login({
        id: '1',
        email,
        name: 'Nature Lover',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isPremium: false,
        preferences: {
          favoriteGenres: ['nature', 'sleep'],
          sleepGoal: 8,
          wakeUpTime: '07:00',
          bedTime: '23:00',
          enableSmartAlarms: true,
          preferredNarrators: [],
          autoDownload: false,
          dataUsageLimit: 500,
        },
        stats: {
          totalListeningTime: 2700, // 45 hours
          sleepSessions: 127,
          meditationSessions: 45,
          currentStreak: 23,
          longestStreak: 45,
          favoriteContent: [],
          weeklyProgress: [],
        },
        createdAt: new Date(),
        lastLoginAt: new Date(),
      });
      
    } catch (error) {
      Alert.alert('Lỗi đăng nhập', 'Không thể đăng nhập. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[
          theme.colors.primaryContainer + '40',
          theme.colors.tertiaryContainer + '30',
          theme.colors.background,
        ]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header Section */}
          <Animated.View style={[styles.header, logoAnimatedStyle]}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="leaf" size={48} color={theme.colors.onPrimary} />
            </View>
            
            <Text style={[styles.appTitle, { color: theme.colors.onSurface }]}>
              RelaxAlarm 🌿
            </Text>
            
            <Text style={[styles.appSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Natural Sleep & Relaxation Companion
            </Text>
          </Animated.View>
          
          {/* Login Form */}
          <Animated.View style={[styles.formContainer, contentAnimatedStyle]}>
            <Animated.View entering={FadeInDown.delay(400).duration(600)}>
              <Card variant="elevated" style={styles.formCard}>
                <LinearGradient
                  colors={[
                    theme.colors.surface,
                    theme.colors.surfaceContainer + '50',
                  ]}
                  style={styles.cardGradient}
                >
                  <Text style={[styles.formTitle, { color: theme.colors.onSurface }]}>
                    Chào mừng trở lại! 🍃
                  </Text>
                  
                  <View style={styles.formFields}>
                    <TextField
                      placeholder="Email của bạn"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      leftIcon="mail"
                      style={styles.textField}
                    />
                    
                    <TextField
                      placeholder="Mật khẩu"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      leftIcon="lock-closed"
                      style={styles.textField}
                    />
                  </View>
                  
                  <Button
                    variant="filled"
                    color="primary"
                    onPress={handleLogin}
                    loading={isLoading}
                    icon="log-in"
                    style={styles.loginButton}
                  >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập với thiên nhiên'}
                  </Button>
                  
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={[styles.forgotText, { color: theme.colors.primary }]}>
                      Quên mật khẩu? 🌱
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Card>
            </Animated.View>
            
            {/* Social Login */}
            <Animated.View 
              entering={FadeInDown.delay(600).duration(600)}
              style={styles.socialContainer}
            >
              <Text style={[styles.socialText, { color: theme.colors.onSurfaceVariant }]}>
                Hoặc đăng nhập với
              </Text>
              
              <View style={styles.socialButtons}>
                <TouchableOpacity 
                  style={[styles.socialButton, { backgroundColor: theme.colors.surfaceVariant }]}
                >
                  <Ionicons name="logo-google" size={24} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.socialButton, { backgroundColor: theme.colors.surfaceVariant }]}
                >
                  <Ionicons name="logo-apple" size={24} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            {/* Sign Up */}
            <Animated.View 
              entering={FadeInUp.delay(800).duration(600)}
              style={styles.signupContainer}
            >
              <Text style={[styles.signupText, { color: theme.colors.onSurfaceVariant }]}>
                Chưa có tài khoản?
              </Text>
              <TouchableOpacity>
                <Text style={[styles.signupLink, { color: theme.colors.primary }]}>
                  {' '}Tạo tài khoản mới 🌿
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  formCard: {
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 24,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  formFields: {
    gap: 16,
    marginBottom: 24,
  },
  textField: {
    // TextField styles handled by component
  },
  loginButton: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  socialText: {
    fontSize: 14,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;