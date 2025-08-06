/**
 * Modern Text Input Component with Material Design 3
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { lightAppTheme, darkAppTheme } from '../../constants/theme';
import { useThemeStore } from '../../stores';

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  testID?: string;
  style?: any;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  disabled = false,
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  testID,
  style,
}) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  
  const labelAnimation = useSharedValue(value ? 1 : 0);
  const borderAnimation = useSharedValue(0);

  const animatedLabelStyle = useAnimatedStyle(() => {
    const translateY = interpolate(labelAnimation.value, [0, 1], [0, -12]);
    const scale = interpolate(labelAnimation.value, [0, 1], [1, 0.85]);
    
    return {
      transform: [
        { translateY },
        { scale },
      ],
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolate(
      borderAnimation.value,
      [0, 1],
      [theme.colors.outline, theme.colors.primary] as any
    );
    
    return {
      borderColor,
      borderWidth: interpolate(borderAnimation.value, [0, 1], [1, 2]),
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    labelAnimation.value = withTiming(1, { duration: theme.animation.normal });
    borderAnimation.value = withTiming(1, { duration: theme.animation.normal });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      labelAnimation.value = withTiming(0, { duration: theme.animation.normal });
    }
    borderAnimation.value = withTiming(0, { duration: theme.animation.normal });
  };

  const toggleSecureText = () => {
    setIsSecure(!isSecure);
  };

  const getContainerStyle = () => ({
    marginBottom: theme.spacing.md,
    opacity: disabled ? 0.5 : 1,
  });

  const getInputContainerStyle = () => ({
    flexDirection: 'row' as const,
    alignItems: multiline ? 'flex-start' : 'center' as const,
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: multiline ? theme.spacing.md : theme.spacing.sm,
    minHeight: multiline ? 60 : 48,
    borderWidth: error ? 2 : 1,
    borderColor: error ? theme.colors.error : 
                 isFocused ? theme.colors.primary : theme.colors.outline,
  });

  const getInputStyle = () => ({
    flex: 1,
    ...theme.typography.bodyLarge,
    color: theme.colors.onSurface,
    textAlignVertical: multiline ? 'top' as const : 'center' as const,
    paddingTop: multiline ? 0 : undefined,
    marginLeft: leftIcon ? theme.spacing.sm : 0,
    marginRight: rightIcon ? theme.spacing.sm : 0,
  });

  const getLabelStyle = () => ({
    position: 'absolute' as const,
    left: leftIcon ? 44 : theme.spacing.md,
    top: multiline ? theme.spacing.md : 14,
    ...theme.typography.bodyLarge,
    color: error ? theme.colors.error :
           isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant,
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 4,
    zIndex: 1,
  });

  const getHelperTextStyle = () => ({
    ...theme.typography.bodySmall,
    color: error ? theme.colors.error : theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  });

  return (
    <View style={[getContainerStyle(), style]}>
      <View style={{ position: 'relative' }}>
        {label && (
          <Animated.Text style={[getLabelStyle(), animatedLabelStyle]}>
            {label}
          </Animated.Text>
        )}
        
        <Animated.View style={[getInputContainerStyle(), animatedBorderStyle]}>
          {leftIcon && (
            <Ionicons
              name={leftIcon as any}
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          )}
          
          <TextInput
            style={getInputStyle()}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={!label ? placeholder : undefined}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            editable={!disabled}
            secureTextEntry={isSecure}
            multiline={multiline}
            numberOfLines={numberOfLines}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            testID={testID}
          />
          
          {rightIcon && (
            <TouchableOpacity onPress={onRightIconPress || toggleSecureText}>
              <Ionicons
                name={secureTextEntry && rightIcon === 'eye-off' && !isSecure ? 'eye' as any : rightIcon as any}
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
      
      {(error || helperText) && (
        <Text style={getHelperTextStyle()}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});