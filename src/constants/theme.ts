/**
 * Modern Design System for RelaxAlarm
 * Based on Material Design 3 with custom adaptations
 */

export interface ColorPalette {
  // Primary Colors - Moss Green Theme
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  
  // Secondary Colors - Water Drop Accents
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  
  // Tertiary Colors - Nature Inspired
  tertiary: string;
  tertiaryContainer: string;
  onTertiary: string;
  onTertiaryContainer: string;
  
  // Error Colors
  error: string;
  errorContainer: string;
  onError: string;
  onErrorContainer: string;
  
  // Neutral Colors
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  
  // Surface Colors
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceContainerLow: string;
  surfaceContainerLowest: string;
  
  // Special Colors
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

export const lightTheme: ColorPalette = {
  // Primary - Moss Green
  primary: '#4F8A6E',
  primaryContainer: '#A8D5BE',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#0F2419',
  
  // Secondary - Water Drop Blue
  secondary: '#87CEEB',
  secondaryContainer: '#B8E6FF',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#1A1F3A',
  
  // Tertiary - Earth Tones
  tertiary: '#A67C5A',
  tertiaryContainer: '#D4C4A8',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#2A1F0F',
  
  // Error
  error: '#E63946',
  errorContainer: '#FFEAEA',
  onError: '#FFFFFF',
  onErrorContainer: '#3A0A0A',
  
  // Neutral
  background: '#F7FDF7',
  onBackground: '#2D5A3D',
  surface: '#FFFFFF',
  onSurface: '#2D5A3D',
  surfaceVariant: '#F0F7F0',
  onSurfaceVariant: '#6B8A6B',
  outline: '#7FB069',
  outlineVariant: '#B8D4B8',
  
  // Surface variants
  surfaceContainer: '#F8FDF8',
  surfaceContainerHigh: '#F5FAF5',
  surfaceContainerHighest: '#F2F7F2',
  surfaceContainerLow: '#FBFEFB',
  surfaceContainerLowest: '#FEFFFE',
  
  // Special
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#2D5A3D',
  inverseOnSurface: '#F7FDF7',
  inversePrimary: '#A8D5BE',
};

export const darkTheme: ColorPalette = {
  // Primary - Moss Green (adjusted for dark)
  primary: '#7FB069',
  primaryContainer: '#3A5A3A',
  onPrimary: '#0F2419',
  onPrimaryContainer: '#A8D5BE',
  
  // Secondary - Water Drop Blue (adjusted for dark)
  secondary: '#6BB6D6',
  secondaryContainer: '#2A4A5A',
  onSecondary: '#1A1F3A',
  onSecondaryContainer: '#B8E6FF',
  
  // Tertiary - Earth Tones (adjusted for dark)
  tertiary: '#C4A488',
  tertiaryContainer: '#4A3A2A',
  onTertiary: '#2A1F0F',
  onTertiaryContainer: '#D4C4A8',
  
  // Error
  error: '#FF6B6B',
  errorContainer: '#5A2A2A',
  onError: '#3A0A0A',
  onErrorContainer: '#FFEAEA',
  
  // Neutral
  background: '#1A2E1A',
  onBackground: '#B8D4B8',
  surface: '#243324',
  onSurface: '#B8D4B8',
  surfaceVariant: '#2A3A2A',
  onSurfaceVariant: '#8FA48F',
  outline: '#6B8A6B',
  outlineVariant: '#4A6741',
  
  // Surface variants
  surfaceContainer: '#1F2F1F',
  surfaceContainerHigh: '#2A3A2A',
  surfaceContainerHighest: '#354235',
  surfaceContainerLow: '#1A2A1A',
  surfaceContainerLowest: '#0F1F0F',
  
  // Special
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#B8D4B8',
  inverseOnSurface: '#1A2E1A',
  inversePrimary: '#4F8A6E',
};

// Typography Scale
export interface TypographyScale {
  displayLarge: TextStyle;
  displayMedium: TextStyle;
  displaySmall: TextStyle;
  headlineLarge: TextStyle;
  headlineMedium: TextStyle;
  headlineSmall: TextStyle;
  titleLarge: TextStyle;
  titleMedium: TextStyle;
  titleSmall: TextStyle;
  bodyLarge: TextStyle;
  bodyMedium: TextStyle;
  bodySmall: TextStyle;
  labelLarge: TextStyle;
  labelMedium: TextStyle;
  labelSmall: TextStyle;
}

interface TextStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  letterSpacing?: number;
}

export const typography: TypographyScale = {
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400',
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400',
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400',
  },
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400',
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400',
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400',
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400',
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
};

// Spacing System - 8px base unit
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Border Radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;

// Elevation (Shadow) System
export const elevation = {
  level0: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  level2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  level3: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  level4: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  level5: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;

// Animation Timings
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  extraSlow: 1000,
} as const;

// Easing Functions
export const easing = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1],
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15],
  standard: [0.2, 0, 0, 1],
} as const;

// Theme interface
export interface Theme {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  elevation: typeof elevation;
  animation: typeof animation;
  easing: typeof easing;
  isDark: boolean;
}

// Default themes
export const lightAppTheme: Theme = {
  colors: lightTheme,
  typography,
  spacing,
  borderRadius,
  elevation,
  animation,
  easing,
  isDark: false,
};

export const darkAppTheme: Theme = {
  colors: darkTheme,
  typography,
  spacing,
  borderRadius,
  elevation,
  animation,
  easing,
  isDark: true,
};