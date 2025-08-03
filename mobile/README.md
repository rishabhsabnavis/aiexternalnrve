# 🎮 Rhyme Racer Mobile

A React Native mobile app for the rhythm-based lyric completion game with beautiful purple theme.

## 📱 Features

- **Touch-optimized controls** for mobile gameplay
- **Real-time beat synchronization** with visual feedback
- **Beautiful purple gradient theme** throughout the app
- **Native animations** for smooth performance
- **Responsive design** for all screen sizes
- **Offline-capable** with local game logic

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)

### Installation

```bash
cd mobile
npm install
```

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Metro Bundler
```bash
npm start
```

## 🎯 Game Features

- **90-second game sessions** with increasing difficulty
- **4 comprehensive metrics** tracking:
  - Rhyme accuracy
  - Beat synchronization
  - Tone matching
  - Reaction speed
- **Real-time feedback** with visual indicators
- **Leaderboard system** with animated rankings
- **Touch-optimized UI** for mobile gameplay

## 🎨 Design

- **Purple gradient theme** (`#8B5CF6` → `#A855F7` → `#C084FC`)
- **Glassmorphism effects** with backdrop blur
- **Smooth animations** using React Native Animated
- **Responsive typography** that scales with screen size
- **Touch-friendly buttons** with proper hit areas

## 📱 Mobile Optimizations

- **Touch feedback** with activeOpacity
- **Gesture handling** for smooth interactions
- **Safe area handling** for notches and home indicators
- **Performance optimizations** with native animations
- **Offline fallback** for game logic

## 🏗️ Architecture

```
mobile/
├── App.tsx                 # Main app component
├── src/
│   └── screens/           # Game screens
│       ├── HomeScreen.tsx
│       ├── GameScreen.tsx
│       ├── GameOverScreen.tsx
│       └── LeaderboardScreen.tsx
├── package.json           # Dependencies
└── metro.config.js       # Metro bundler config
```

## 🔧 Development

### Dependencies

- **React Native** - Mobile framework
- **React Navigation** - Screen navigation
- **React Native Linear Gradient** - Gradient backgrounds
- **React Native Reanimated** - Smooth animations
- **Axios** - HTTP client for API calls

### Key Components

- **HomeScreen** - Player name input and game start
- **GameScreen** - Main gameplay with touch controls
- **GameOverScreen** - Final metrics and replay options
- **LeaderboardScreen** - Animated leaderboard display

## 📊 Game Metrics

The mobile app tracks the same 4 key metrics as the web version:

1. **Rhyme Accuracy** - Phonetic similarity scoring
2. **Beat Sync** - Timing precision measurement
3. **Tone Match** - Contextual appropriateness
4. **Reaction Speed** - Response time tracking

## 🎵 Gameplay

1. **Enter your name** on the home screen
2. **Tap rhyming words** in rhythm with the beat
3. **Watch the beat grid** pulse to stay in sync
4. **Get real-time feedback** on your performance
5. **View final metrics** and compare scores

## 🚀 Deployment

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -workspace RhymeRacerMobile.xcworkspace -scheme RhymeRacerMobile -configuration Release
```

## 📱 Platform Support

- **Android** - API level 21+ (Android 5.0+)
- **iOS** - iOS 12.0+
- **React Native** - 0.72.6

## 🎮 Ready to Race!

The mobile app provides the same exciting gameplay as the web version, optimized for touch controls and mobile performance. Enjoy the rhythm! 🎵 