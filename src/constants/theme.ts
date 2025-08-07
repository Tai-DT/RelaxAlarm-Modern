/**
 * Modern Material Design 3 Theme with Natural Forest Colors
 * Optimized for wellness and relaxation apps
 */

export interface AppTheme {
  colors: {
    // Primary Colors (Forest Green)
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    
    // Secondary Colors (Lavender)
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    
    // Tertiary Colors (Sage)
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    
    // Error Colors
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    
    // Surface Colors
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    surfaceContainer: string;
    
    // Outline
    outline: string;
    outlineVariant: string;
    
    // Special
    scrim: string;
    shadow: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    displayLarge: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    displayMedium: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    displaySmall: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    headlineLarge: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    headlineMedium: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    headlineSmall: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    titleLarge: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    titleMedium: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    titleSmall: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    bodyLarge: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    bodyMedium: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    bodySmall: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    labelLarge: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    labelMedium: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    labelSmall: {
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
  };
}

// Light Theme with Natural Forest Colors
export const lightAppTheme: AppTheme = {
  colors: {
    // Primary Colors (Moss Green - Nature-inspired)
    primary: '#2D5C42',
    onPrimary: '#FFFFFF',
    primaryContainer: '#A8D5BA',
    onPrimaryContainer: '#0A1F0F',
    
    // Secondary Colors (Soft Lavender - Relaxation)
    secondary: '#6B7EA6',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#D4E3FF',
    onSecondaryContainer: '#1A2C54',
    
    // Tertiary Colors (Sage Green - Calm)
    tertiary: '#7A8471',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#C5D2B8',
    onTertiaryContainer: '#252F1E',
    
    // Error Colors
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    
    // Surface Colors (Warm Cream Backgrounds)
    background: '#FBF9F5',
    onBackground: '#1C1B17',
    surface: '#FFFBFF',
    onSurface: '#1C1B17',
    surfaceVariant: '#F1F0E8',
    onSurfaceVariant: '#44433D',
    surfaceContainer: '#F5F2ED',
    
    // Outline
    outline: '#757069',
    outlineVariant: '#C6C3BC',
    
    // Special
    scrim: '#000000',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    displayLarge: {
      fontSize: 57,
      lineHeight: 64,
      fontWeight: '400',
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
    },
    titleSmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodyMedium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
    labelLarge: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    labelMedium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
    },
    labelSmall: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '500',
    },
  },
};

// Dark Theme with Natural Forest Colors
export const darkAppTheme: AppTheme = {
  colors: {
    // Primary Colors (Brighter Green for dark theme)
    primary: '#8BC9A3',
    onPrimary: '#0A1F0F',
    primaryContainer: '#1E3F2A',
    onPrimaryContainer: '#A8D5BA',
    
    // Secondary Colors (Soft Blue)
    secondary: '#A5C3FF',
    onSecondary: '#1A2C54',
    secondaryContainer: '#334A7A',
    onSecondaryContainer: '#D4E3FF',
    
    // Tertiary Colors (Light Sage)
    tertiary: '#B5C8A8',
    onTertiary: '#252F1E',
    tertiaryContainer: '#3B4634',
    onTertiaryContainer: '#C5D2B8',
    
    // Error Colors
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    // Surface Colors (Dark Forest Backgrounds)
    background: '#131311',
    onBackground: '#E6E3DE',
    surface: '#1C1B17',
    onSurface: '#E6E3DE',
    surfaceVariant: '#44433D',
    onSurfaceVariant: '#C6C3BC',
    surfaceContainer: '#211F1A',
    
    // Outline
    outline: '#8F8D86',
    outlineVariant: '#44433D',
    
    // Special
    scrim: '#000000',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    displayLarge: {
      fontSize: 57,
      lineHeight: 64,
      fontWeight: '400',
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
    },
    titleSmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodyMedium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
    labelLarge: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    labelMedium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
    },
    labelSmall: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '500',
    },
  },
};

// Common Theme Values
export const commonTheme = {
  // Animation Durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Elevation Shadows
  elevation: {
    level0: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    level1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    level2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    level3: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    level4: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    level5: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
  },
  
  // Nature-themed Icons
  icons: {
    nature: {
      leaf: 'leaf',
      tree: 'tree',
      flower: 'flower',
      sun: 'sunny',
      moon: 'moon',
      stars: 'star',
      water: 'water',
      fire: 'flame',
      wind: 'cloudy',
      earth: 'earth',
    },
    wellness: {
      meditation: 'flower',
      sleep: 'bed',
      relaxation: 'heart',
      breathing: 'wind',
      mindfulness: 'leaf',
    },
  },
  
  // Natural Color Palette Extensions
  naturalColors: {
    forest: {
      dark: '#1B3B2D',
      medium: '#2D5C42', 
      light: '#4A7C59',
      pale: '#A8D5BA',
    },
    ocean: {
      dark: '#1A4D66',
      medium: '#2E7D93',
      light: '#5BA4C7',
      pale: '#B8E6FF',
    },
    earth: {
      dark: '#5D4037',
      medium: '#8D6E63',
      light: '#A1887F',
      pale: '#D7CCC8',
    },
    sky: {
      dark: '#1565C0',
      medium: '#42A5F5',
      light: '#81C784',
      pale: '#E3F2FD',
    },
  },
};