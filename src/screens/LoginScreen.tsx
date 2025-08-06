/**
 * Updated Login Screen with Natural Color Palette
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

// Import components
import { Button, TextField, Card } from '../components/ui';

// Import stores
import { useAuthStore, useThemeStore } from '../stores';
import { lightAppTheme, darkAppTheme } from '../constants/theme';
import { LoginForm, ValidationRule } from '../types';

const LoginScreen: React.FC = () => {
  const { login, isLoading, error } = useAuthStore();
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  // Form state
  const [form, setForm] = useState<LoginForm>({
    email: { value: '', error: '', touched: false },
    password: { value: '', error: '', touched: false },
  });
  
  // Animations
  const logoOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  
  React.useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    formTranslateY.value = withDelay(200, withTiming(0, { duration: 600 }));
  }, []);
  
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));
  
  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formTranslateY.value }],
    opacity: formTranslateY.value === 0 ? 1 : 0,
  }));
  
  // Validation rules
  const validationRules: Record<string, ValidationRule> = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 6,
    },
  };
  
  const validateField = (field: string, value: string): string => {
    const rules = validationRules[field];
    if (!rules) return '';
    
    if (rules.required && !value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`;
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return field === 'email' ? 'Please enter a valid email address' : 'Invalid format';
    }
    
    return '';
  };
  
  const updateField = (field: keyof LoginForm, value: string) => {
    const error = validateField(field, value);
    setForm(prev => ({
      ...prev,
      [field]: {
        value,
        error,
        touched: true,
      },
    }));
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newForm = { ...form };
    
    Object.keys(form).forEach(field => {
      const fieldKey = field as keyof LoginForm;
      const error = validateField(field, form[fieldKey].value);
      newForm[fieldKey] = {
        ...form[fieldKey],
        error,
        touched: true,
      };
      if (error) isValid = false;
    });
    
    setForm(newForm);
    return isValid;
  };
  
  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }
    
    try {
      await login(form.email.value, form.password.value);
    } catch (err) {
      Alert.alert('Login Failed', error || 'An error occurred during login');
    }
  };
  
  const renderLogo = () => (
    <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.tertiary]}
        style={styles.logoIcon}
      >
        <Text style={[styles.logoText, { color: theme.colors.onPrimary }]}>
          🌿
        </Text>
      </LinearGradient>
      <Text style={[styles.appName, { color: theme.colors.onSurface }]}>
        RelaxAlarm
      </Text>
      <Text style={[styles.appTagline, { color: theme.colors.onSurfaceVariant }]}>
        Your Natural Sleep & Relaxation Companion
      </Text>
    </Animated.View>
  );
  
  const renderForm = () => (
    <Animated.View style={formAnimatedStyle}>
      <Card 
        variant="elevated" 
        padding="lg" 
        style={[styles.formCard, { backgroundColor: theme.colors.surfaceContainer }]}
      >
        <Text style={[styles.formTitle, { color: theme.colors.onSurface }]}>
          Welcome Back 🌙
        </Text>
        <Text style={[styles.formSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Sign in to continue your peaceful journey
        </Text>
        
        <View style={styles.formFields}>
          <TextField
            label="Email"
            value={form.email.value}
            onChangeText={(value) => updateField('email', value)}
            error={form.email.touched ? form.email.error : undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="mail-outline"
            testID="email-input"
          />
          
          <TextField
            label="Password"
            value={form.password.value}
            onChangeText={(value) => updateField('password', value)}
            error={form.password.touched ? form.password.error : undefined}
            secureTextEntry
            leftIcon="lock-closed-outline"
            rightIcon="eye-off"
            testID="password-input"
          />
        </View>
        
        {error && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}
        
        <Button
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          variant="filled"
          color="primary"
          size="large"
          fullWidth
          style={styles.loginButton}
          testID="login-button"
        >
          Sign In to Relax
        </Button>
        
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
          <Text style={[styles.dividerText, { color: theme.colors.onSurfaceVariant }]}>
            or
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
        </View>
        
        <Button
          onPress={() => {
            // Navigate to register
          }}
          variant="outlined"
          color="secondary"
          size="large"
          fullWidth
          icon="person-add-outline"
          testID="register-button"
        >
          Create New Account
        </Button>
        
        <View style={styles.helpSection}>
          <Text style={[styles.helpText, { color: theme.colors.onSurfaceVariant }]}>
            Need help? 
          </Text>
          <Button
            variant="text"
            size="small"
            onPress={() => {
              // Handle forgot password
            }}
          >
            Forgot Password?
          </Button>
        </View>
      </Card>
    </Animated.View>
  );
  
  return (
    <LinearGradient
      colors={[
        theme.colors.primaryContainer + '30',
        theme.colors.background,
        theme.colors.tertiaryContainer + '20',
      ]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderLogo()}
            {renderForm()}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    // Card styles handled by Card component
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  formFields: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  helpText: {
    fontSize: 14,
  },
});

export default LoginScreen;