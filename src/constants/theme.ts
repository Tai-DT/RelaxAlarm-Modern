/**
 * Updated Material Design 3 Theme - RelaxAlarm Natural Colors
 */

export interface AppTheme {
  colors: {
    // Primary colors - Natural moss green
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    
    // Secondary colors - Soft water blue
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    
    // Tertiary colors - Fresh nature green
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    
    // Error colors
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    
    // Background colors
    background: string;
    onBackground: string;
    
    // Surface colors
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    surfaceTint: string;
    
    // Outline colors
    outline: string;
    outlineVariant: string;
    
    // Additional surface colors
    surfaceDim: string;
    surfaceBright: string;
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
  };
  typography: {
    displayLarge: any;
    displayMedium: any;
    displaySmall: any;
    headlineLarge: any;
    headlineMedium: any;
    headlineSmall: any;
    titleLarge: any;
    titleMedium: any;
    titleSmall: any;
    labelLarge: any;
    labelMedium: any;
    labelSmall: any;
    bodyLarge: any;
    bodyMedium: any;
    bodySmall: any;
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
  elevation: {
    level0: any;
    level1: any;
    level2: any;
    level3: any;
    level4: any;
    level5: any;
  };
  animation: {
    duration: {
      short: number;
      medium: number;
      long: number;
    };
    easing: {
      standard: string;
      emphasized: string;
      decelerated: string;
      accelerated: string;
    };
  };
}

// Light Theme - Natural & Calming
export const lightAppTheme: AppTheme = {
  colors: {
    // Primary - Deeper moss green for better contrast
    primary: '#2D5C42',           // Deeper moss green
    onPrimary: '#FFFFFF',         // White text
    primaryContainer: '#B8E6C7',  // Light moss container
    onPrimaryContainer: '#0A2F1B', // Dark green text
    
    // Secondary - Soft lavender (relaxing)
    secondary: '#6B7EA6',         // Soft lavender blue
    onSecondary: '#FFFFFF',       // White text
    secondaryContainer: '#D4E1FF', // Light lavender container
    onSecondaryContainer: '#1C2944', // Dark blue text
    
    // Tertiary - Warm sage
    tertiary: '#7A8471',          // Warm sage green
    onTertiary: '#FFFFFF',        // White text
    tertiaryContainer: '#E8F5DD',  // Light sage container
    onTertiaryContainer: '#2D3B27', // Dark sage text
    
    // Error colors
    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',
    
    // Background - Warm cream
    background: '#FBF9F5',        // Warm cream background
    onBackground: '#1C1B16',      // Dark brown text
    
    // Surface - Slightly warmer white
    surface: '#FBF9F5',           // Same as background
    onSurface: '#1C1B16',         // Dark brown text
    surfaceVariant: '#E0E4D6',    // Light sage variant
    onSurfaceVariant: '#44483E',  // Medium dark text
    surfaceTint: '#2D5C42',       // Primary color
    
    // Outline colors
    outline: '#74796D',           // Medium sage
    outlineVariant: '#C4C8BB',    // Light sage outline
    
    // Additional surface colors
    surfaceDim: '#DCD9D0',
    surfaceBright: '#FBF9F5',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F5F2E9',
    surfaceContainer: '#EFECDF',
    surfaceContainerHigh: '#E9E6D9',
    surfaceContainerHighest: '#E4E1D4',
  },
  typography: {
    displayLarge: {
      fontSize: 57,
      fontWeight: '400',
      lineHeight: 64,
      letterSpacing: -0.25,
    },
    displayMedium: {
      fontSize: 45,
      fontWeight: '400',
      lineHeight: 52,
      letterSpacing: 0,
    },
    displaySmall: {
      fontSize: 36,
      fontWeight: '400',
      lineHeight: 44,
      letterSpacing: 0,
    },
    headlineLarge: {
      fontSize: 32,
      fontWeight: '400',
      lineHeight: 40,
      letterSpacing: 0,
    },
    headlineMedium: {
      fontSize: 28,
      fontWeight: '400',
      lineHeight: 36,
      letterSpacing: 0,
    },
    headlineSmall: {
      fontSize: 24,
      fontWeight: '400',
      lineHeight: 32,
      letterSpacing: 0,
    },
    titleLarge: {
      fontSize: 22,
      fontWeight: '400',
      lineHeight: 28,
      letterSpacing: 0,
    },
    titleMedium: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    titleSmall: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelLarge: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontSize: 11,
      fontWeight: '500',
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      letterSpacing: 0.4,
    },
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
  elevation: {
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
      shadowOffset: { width: 0, height: 2 },
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
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
      elevation: 4,
    },
    level5: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.20,
      shadowRadius: 16,
      elevation: 5,
    },
  },
  animation: {
    duration: {
      short: 150,
      medium: 300,
      long: 500,
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
      decelerated: 'cubic-bezier(0, 0, 0.2, 1)',
      accelerated: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
};

// Dark Theme - Sophisticated night mode
export const darkAppTheme: AppTheme = {
  colors: {
    // Primary - Bright moss green for dark theme
    primary: '#9DD4B8',           // Light moss green
    onPrimary: '#0A2F1B',         // Dark green text
    primaryContainer: '#1B4A2E',  // Medium moss container
    onPrimaryContainer: '#B8E6C7', // Light moss text
    
    // Secondary - Soft lavender
    secondary: '#A6C8FF',         // Light lavender
    onSecondary: '#1C2944',       // Dark blue text
    secondaryContainer: '#34405B', // Medium blue container
    onSecondaryContainer: '#D4E1FF', // Light lavender text
    
    // Tertiary - Light sage
    tertiary: '#C0CCAB',          // Light sage
    onTertiary: '#2D3B27',        // Dark sage text
    tertiaryContainer: '#43503C',  // Medium sage container
    onTertiaryContainer: '#E8F5DD', // Light sage text
    
    // Error colors
    error: '#F2B8B5',
    onError: '#601410',
    errorContainer: '#8C1D18',
    onErrorContainer: '#F9DEDC',
    
    // Background - Deep warm dark
    background: '#141210',        // Very dark brown
    onBackground: '#E6E3DB',      // Light cream text
    
    // Surface colors
    surface: '#141210',           // Same as background
    onSurface: '#E6E3DB',         // Light cream text
    surfaceVariant: '#44483E',    // Dark sage variant
    onSurfaceVariant: '#C4C8BB',  // Light sage text
    surfaceTint: '#9DD4B8',       // Primary color
    
    // Outline colors
    outline: '#8E9286',           // Medium sage
    outlineVariant: '#44483E',    // Dark sage outline
    
    // Additional surface colors
    surfaceDim: '#141210',
    surfaceBright: '#3A382F',
    surfaceContainerLowest: '#0F0E0C',
    surfaceContainerLow: '#1C1B16',
    surfaceContainer: '#20201A',
    surfaceContainerHigh: '#2B2A24',
    surfaceContainerHighest: '#36342E',
  },
  typography: lightAppTheme.typography,
  spacing: lightAppTheme.spacing,
  borderRadius: lightAppTheme.borderRadius,
  elevation: {
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
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 1,
    },
    level2: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.20,
      shadowRadius: 4,
      elevation: 2,
    },
    level3: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 3,
    },
    level4: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.30,
      shadowRadius: 12,
      elevation: 4,
    },
    level5: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 5,
    },
  },
  animation: lightAppTheme.animation,
};