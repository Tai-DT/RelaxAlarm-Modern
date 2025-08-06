/**
 * Modern Button Component with Material Design 3
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { lightAppTheme, darkAppTheme } from '../../constants/theme';
import { ButtonProps } from '../../types';
import { useThemeStore } from '../../stores';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const Button: React.FC<ButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  variant = 'filled',
  size = 'medium',
  color = 'primary',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  style,
  testID,
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
    opacity.value = withTiming(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...theme.elevation.level1,
    };

    // Size styles
    const sizeStyles = {
      small: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 32,
      },
      medium: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: 40,
      },
      large: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: 48,
      },
    };

    // Color and variant styles
    const colorKey = color === 'primary' ? theme.colors.primary :
                     color === 'secondary' ? theme.colors.secondary :
                     theme.colors.error;

    const variantStyles = {
      filled: {
        backgroundColor: disabled ? theme.colors.surfaceVariant : colorKey,
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? theme.colors.outline : colorKey,
      },
      text: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        ...theme.elevation.level0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: '500' as const,
      letterSpacing: 0.5,
    };

    const sizeTextStyles = {
      small: theme.typography.labelMedium,
      medium: theme.typography.labelLarge,
      large: theme.typography.titleMedium,
    };

    const colorKey = color === 'primary' ? theme.colors.primary :
                     color === 'secondary' ? theme.colors.secondary :
                     theme.colors.error;

    const variantTextStyles = {
      filled: {
        color: variant === 'filled' ? 
          (color === 'primary' ? theme.colors.onPrimary :
           color === 'secondary' ? theme.colors.onSecondary :
           theme.colors.onError) : colorKey,
      },
      outlined: {
        color: disabled ? theme.colors.onSurfaceVariant : colorKey,
      },
      text: {
        color: disabled ? theme.colors.onSurfaceVariant : colorKey,
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const iconColor = getTextStyle().color;

  return (
    <AnimatedTouchableOpacity
      style={[animatedStyle, getButtonStyle(), style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      testID={testID}
      activeOpacity={1}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={iconColor} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon as any} 
              size={iconSize} 
              color={iconColor}
              style={{ marginRight: theme.spacing.sm }}
            />
          )}
          
          {typeof children === 'string' ? (
            <Text style={getTextStyle()}>{children}</Text>
          ) : (
            children
          )}
          
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon as any} 
              size={iconSize} 
              color={iconColor}
              style={{ marginLeft: theme.spacing.sm }}
            />
          )}
        </>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});