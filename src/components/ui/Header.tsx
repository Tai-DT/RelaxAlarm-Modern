/**
 * Modern Header Component
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { lightAppTheme, darkAppTheme } from '../../constants/theme';
import { useThemeStore } from '../../stores';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  transparent?: boolean;
  testID?: string;
  style?: any;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  transparent = false,
  testID,
  style,
}) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkAppTheme : lightAppTheme;
  const insets = useSafeAreaInsets();

  const getHeaderStyle = () => ({
    backgroundColor: transparent ? 'transparent' : theme.colors.surface,
    paddingTop: insets.top,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: transparent ? 0 : 1,
    borderBottomColor: theme.colors.outlineVariant,
    ...(!transparent && theme.elevation.level1),
  });

  const getContentStyle = () => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between',
    minHeight: 48,
  });

  const getTitleContainerStyle = () => ({
    flex: 1,
    alignItems: 'center' as const,
    marginHorizontal: theme.spacing.md,
  });

  const getTitleStyle = () => ({
    ...theme.typography.titleLarge,
    color: theme.colors.onSurface,
    textAlign: 'center' as const,
  });

  const getSubtitleStyle = () => ({
    ...theme.typography.bodyMedium,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center' as const,
    marginTop: 2,
  });

  const getIconButtonStyle = () => ({
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'transparent',
  });

  const iconColor = theme.colors.onSurface;

  return (
    <View style={[getHeaderStyle(), style]} testID={testID}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : theme.colors.surface}
        translucent={transparent}
      />
      
      <View style={getContentStyle()}>
        {/* Left Icon */}
        {leftIcon ? (
          <TouchableOpacity
            style={getIconButtonStyle()}
            onPress={onLeftPress}
            testID={`${testID}-left-button`}
          >
            <Ionicons
              name={leftIcon as any}
              size={24}
              color={iconColor}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
        
        {/* Title */}
        <View style={getTitleContainerStyle()}>
          <Text style={getTitleStyle()} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={getSubtitleStyle()} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        
        {/* Right Icon */}
        {rightIcon ? (
          <TouchableOpacity
            style={getIconButtonStyle()}
            onPress={onRightPress}
            testID={`${testID}-right-button`}
          >
            <Ionicons
              name={rightIcon as any}
              size={24}
              color={iconColor}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});