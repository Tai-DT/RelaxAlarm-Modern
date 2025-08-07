/**
 * Modern UI Components - Button, TextField, Card
 * Material Design 3 with Natural Theme
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  TextInputProps,
  ViewProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeStore } from '../../stores/themeStore';
import { lightAppTheme, darkAppTheme } from '../../constants/theme';

// Button Component
interface ButtonProps extends TouchableOpacityProps {
  variant?: 'filled' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  loading = false,
  icon,
  children,
  style,
  disabled,
  onPress,
  ...props
}) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8, { duration: 150 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1, { duration: 150 });
  };
  
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button_${size}`]];
    
    switch (variant) {
      case 'filled':
        return [
          ...baseStyle,
          {
            backgroundColor: theme.colors[color],
          },
        ];
      case 'outlined':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors[color],
          },
        ];
      case 'text':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
          },
        ];
      default:
        return baseStyle;
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'filled':
        return theme.colors[`on${color.charAt(0).toUpperCase() + color.slice(1)}` as keyof typeof theme.colors];
      case 'outlined':
      case 'text':
        return theme.colors[color];
      default:
        return theme.colors.onPrimary;
    }
  };
  
  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const fontSize = size === 'small' ? 14 : size === 'large' ? 18 : 16;
  
  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        {...props}
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {variant === 'filled' && (
          <LinearGradient
            colors={[
              theme.colors[color],
              theme.colors[color] + 'CC',
            ]}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        
        {loading ? (
          <ActivityIndicator size="small" color={getTextColor()} />
        ) : (
          <View style={styles.buttonContent}>
            {icon && (
              <Ionicons 
                name={icon as any} 
                size={iconSize} 
                color={getTextColor()} 
                style={styles.buttonIcon}
              />
            )}
            <Text style={[styles.buttonText, { color: getTextColor(), fontSize }]}>
              {children}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// TextField Component
interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  const focusScale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }],
  }));
  
  const handleFocus = () => {
    focusScale.value = withSpring(1.02);
  };
  
  const handleBlur = () => {
    focusScale.value = withSpring(1);
  };
  
  return (
    <Animated.View style={[styles.textFieldContainer, animatedStyle, style]}>
      {label && (
        <Text style={[styles.textFieldLabel, { color: theme.colors.onSurfaceVariant }]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.textFieldWrapper,
        {
          backgroundColor: theme.colors.surfaceContainer,
          borderColor: error ? theme.colors.error : theme.colors.outline,
        }
      ]}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon as any} 
            size={20} 
            color={theme.colors.onSurfaceVariant} 
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          {...props}
          style={[
            styles.textFieldInput,
            {
              color: theme.colors.onSurface,
              flex: 1,
            }
          ]}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons 
              name={rightIcon as any} 
              size={20} 
              color={theme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </Animated.View>
  );
};

// Card Component
interface CardProps extends ViewProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  children,
  style,
  ...props
}) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    switch (variant) {
      case 'elevated':
        return [
          ...baseStyle,
          {
            backgroundColor: theme.colors.surface,
            ...styles.cardElevated,
          },
        ];
      case 'filled':
        return [
          ...baseStyle,
          {
            backgroundColor: theme.colors.surfaceContainer,
          },
        ];
      case 'outlined':
        return [
          ...baseStyle,
          {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.outline,
          },
        ];
      default:
        return baseStyle;
    }
  };
  
  return (
    <View {...props} style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Button Styles
  button: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  button_medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  button_large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
  
  // TextField Styles
  textFieldContainer: {
    marginBottom: 4,
  },
  textFieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textFieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  textFieldInput: {
    fontSize: 16,
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  
  // Card Styles
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});