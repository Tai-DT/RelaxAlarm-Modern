/**
 * Modern Card Component with Material Design 3
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { lightAppTheme, darkAppTheme } from '../../constants/theme';
import { CardProps } from '../../types';
import { useThemeStore } from '../../stores';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  margin,
  onPress,
  disabled = false,
  children,
  style,
  testID,
}) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  const scale = useSharedValue(1);
  const elevation = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: elevation.value * (theme.elevation.level2.shadowOpacity || 0),
  }));

  const handlePressIn = () => {
    if (onPress && !disabled) {
      scale.value = withSpring(0.98);
      elevation.value = withTiming(2);
    }
  };

  const handlePressOut = () => {
    if (onPress && !disabled) {
      scale.value = withSpring(1);
      elevation.value = withTiming(1);
    }
  };

  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden' as const,
    };

    const variantStyles = {
      elevated: {
        backgroundColor: theme.colors.surface,
        ...theme.elevation.level1,
      },
      filled: {
        backgroundColor: theme.colors.surfaceContainerHighest,
        ...theme.elevation.level0,
      },
      outlined: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        ...theme.elevation.level0,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      padding: theme.spacing[padding],
      margin: margin ? theme.spacing[margin] : 0,
      opacity: disabled ? 0.5 : 1,
    };
  };

  const CardComponent = onPress ? AnimatedTouchableOpacity : AnimatedView;

  return (
    <CardComponent
      style={[animatedStyle, getCardStyle(), style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      testID={testID}
      activeOpacity={onPress ? 0.95 : 1}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});