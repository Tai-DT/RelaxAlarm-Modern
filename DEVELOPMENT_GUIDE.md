# RelaxAlarm Modern - Setup and Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Studio
- Expo Go app on your device (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/Tai-DT/RelaxAlarm-Modern.git
cd RelaxAlarm-Modern

# Install dependencies
npm install
# or
yarn install

# Start the development server
expo start

# Run on specific platforms
expo run:ios
expo run:android
```

## 📱 Development Commands

```bash
# Development
expo start                 # Start development server
expo start --clear         # Start with cleared cache
expo start --tunnel        # Enable tunnel for remote devices

# Building
expo build:ios            # Build for iOS
expo build:android        # Build for Android
eas build --platform all   # Build with EAS (recommended)

# Testing
npm test                  # Run Jest tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report

# Linting & Formatting
npm run lint              # Run ESLint
npm run lint:fix          # Fix ESLint issues
npm run format            # Format with Prettier

# Type Checking
npm run type-check        # Run TypeScript compiler
npm run type-check:watch  # Watch mode type checking
```

## 🎨 Project Structure

```
RelaxAlarm-Modern/
├── App.tsx                     # Main app component
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── babel.config.js             # Babel configuration
├── metro.config.js             # Metro bundler config
└── src/
    ├── components/
    │   └── ui/                    # Reusable UI components
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── TextField.tsx
    │       └── Header.tsx
    ├── constants/
    │   └── theme.ts              # Material Design 3 theme
    ├── navigation/
    │   └── MainNavigator.tsx     # Navigation structure
    ├── screens/
    │   ├── HomeScreen.tsx
    │   ├── AudiobooksScreen.tsx
    │   ├── SleepScreen.tsx
    │   └── LoginScreen.tsx
    ├── services/
    │   ├── audioService.ts       # Audio playback
    │   ├── apiService.ts         # HTTP client
    │   └── notificationService.ts # Push notifications
    ├── stores/
    │   └── index.ts              # Zustand state management
    └── types/
        └── index.ts              # TypeScript definitions
```

## 🎯 Core Technologies

### **Frontend Stack**
- **Expo 51** - React Native development platform
- **React Navigation 6** - Navigation library
- **TypeScript 5.3** - Type-safe development
- **Zustand 4.5** - State management
- **React Native Reanimated 3** - Animations

### **UI/UX Libraries**
- **@expo/vector-icons** - Icon library
- **expo-linear-gradient** - Gradient backgrounds
- **react-native-svg** - SVG graphics
- **react-native-safe-area-context** - Safe area handling

### **Audio & Media**
- **expo-av** - Audio/video playback
- **expo-media-library** - Media access
- **@react-native-async-storage/async-storage** - Data persistence

### **Notifications**
- **expo-notifications** - Local and push notifications
- **expo-device** - Device information

## 🎨 Theme Customization

### Material Design 3 Colors

```typescript
// Primary Palette (Moss Green Theme)
const lightTheme = {
  colors: {
    primary: '#4F8A6E',           // Moss green
    onPrimary: '#FFFFFF',         // White text on primary
    primaryContainer: '#A8F0C1',  // Light moss container
    onPrimaryContainer: '#002114', // Dark text on container
    
    secondary: '#6BADBC',         // Water blue
    tertiary: '#8FBC6B',          // Fresh green
    
    background: '#FDFDF7',        // Off-white background
    surface: '#FDFDF7',           // Surface color
    surfaceVariant: '#DDE5DB',    // Variant surface
    
    error: '#BA1A1A',             // Error red
    // ... more colors
  }
};
```

### Custom Theme Usage

```typescript
// In components
const { isDark } = useThemeStore();
const theme = isDark ? darkAppTheme : lightAppTheme;

// Apply theme colors
style={{ backgroundColor: theme.colors.primary }}
```

## 🔄 State Management

### Zustand Store Examples

```typescript
// Auth Store
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Login logic
      },
      logout: async () => {
        // Logout logic
      },
    }),
    { name: 'auth-storage' }
  )
);

// Usage in components
const { user, login, logout } = useAuthStore();
```

## 🎧 Audio Integration

### Playing Audio Content

```typescript
import { audioService } from '../services/audioService';

// In component
const playAudiobook = async (audiobook: Audiobook) => {
  try {
    await audioService.loadContent(audiobook);
    await audioService.play();
  } catch (error) {
    console.error('Playback failed:', error);
  }
};
```

## 🔔 Notifications Setup

### Scheduling Alarms

```typescript
import { notificationService } from '../services/notificationService';

// Schedule an alarm
const scheduleAlarm = async () => {
  const alarm: AlarmNotification = {
    id: 'alarm-1',
    title: 'Good Morning!',
    body: 'Time to wake up and relax',
    scheduledTime: new Date(Date.now() + 60000), // 1 minute from now
    isActive: true,
  };
  
  const notificationId = await notificationService.scheduleAlarm(alarm);
};
```

## 📦 Building for Production

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for both platforms
eas build --platform all

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### Classic Build

```bash
# Build APK
expo build:android -t apk

# Build App Store
expo build:ios -t archive
```

## 🛠️ Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   expo start --clear
   npm start -- --reset-cache
   ```

2. **TypeScript errors**
   ```bash
   npm run type-check
   # Fix type issues in reported files
   ```

3. **Audio playback issues**
   - Check device volume
   - Verify audio permissions
   - Test on physical device

4. **Navigation issues**
   - Clear AsyncStorage: `AsyncStorage.clear()`
   - Check navigation structure
   - Verify screen imports

### Performance Tips

1. **Optimize images**
   - Use appropriate image sizes
   - Implement image caching
   - Consider WebP format

2. **Reduce bundle size**
   - Use dynamic imports
   - Remove unused dependencies
   - Enable Hermes engine

3. **Improve animations**
   - Use `useNativeDriver: true`
   - Avoid animating layout properties
   - Implement gesture handling properly

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Material Design 3](https://m3.material.io/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🤝 Contributing

See our contributing guidelines for information on how to contribute to this project.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.