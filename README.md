# 🌙 RelaxAlarm Modern

> A cutting-edge sleep and relaxation companion app built with modern React Native & Expo

[![Expo](https://img.shields.io/badge/Expo-~51.0.0-blue.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.74.5-green.svg)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.3.3-blue.svg)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🎵 Core Features
- **Smart Alarms** - Gentle wake-up with nature sounds
- **Sleep Tracking** - Monitor your sleep patterns
- **Relaxation Library** - Curated sounds for meditation & relaxation
- **Premium Audiobooks** 📚 - Access thousands of sleep stories
- **Exclusive Podcasts** 🎧 - Premium relaxation content

### 🎨 Modern Design
- **Material Design 3** - Latest UI components
- **Dynamic Theming** - Light/Dark mode with system sync
- **Smooth Animations** - Lottie & Reanimated 3
- **Responsive Layout** - Adaptive design for all screen sizes
- **Accessibility First** - WCAG 2.1 AA compliant

### 🚀 Technical Excellence
- **TypeScript** - Full type safety
- **Modern Architecture** - Clean, scalable codebase
- **State Management** - Zustand for predictable state
- **Offline Support** - Works without internet
- **Performance Optimized** - 60fps smooth experience

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base design system components
│   ├── forms/          # Form components
│   └── cards/          # Card components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # API and business logic
├── stores/             # Zustand state stores
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── utils/              # Helper functions
└── constants/          # App constants
```

## 🛠️ Tech Stack

- **Frontend**: React Native 0.74.5 + Expo 51
- **Language**: TypeScript 5.3
- **UI Library**: React Native Paper 5.12
- **Navigation**: React Navigation 6
- **State Management**: Zustand 4.5
- **Animations**: Reanimated 3 + Lottie
- **Audio**: Expo AV
- **Storage**: AsyncStorage
- **HTTP Client**: Axios + React Query

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator / Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/Tai-DT/RelaxAlarm-Modern.git
cd RelaxAlarm-Modern

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Development

```bash
# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Run on Web
npx expo start --web

# Type checking
npm run type-check

# Linting
npm run lint
```

### Building

```bash
# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

## 📱 Screenshots

| Home Screen | Audiobooks | Sleep Tracking | Premium |
|-------------|------------|----------------|---------|
| ![Home](./docs/screenshots/home.png) | ![Audiobooks](./docs/screenshots/audiobooks.png) | ![Sleep](./docs/screenshots/sleep.png) | ![Premium](./docs/screenshots/premium.png) |

## 🎨 Design System

Our design system follows Material Design 3 principles with custom adaptations:

- **Colors**: Moss green primary palette with water drop accents
- **Typography**: Inter font family with 6 size scales
- **Spacing**: 8px base unit with consistent rhythm
- **Components**: 40+ reusable components
- **Animations**: Micro-interactions with 300ms easing

## 🏆 Features Roadmap

- [ ] **AI Sleep Coach** - Personalized sleep recommendations
- [ ] **Social Features** - Share sleep goals with friends
- [ ] **Wearable Integration** - Apple Watch & Wear OS support
- [ ] **Multi-language** - Localization for 10+ languages
- [ ] **Cloud Sync** - Cross-device synchronization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Show your support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ by [Tai-DT](https://github.com/Tai-DT)**