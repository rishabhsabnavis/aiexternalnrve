import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
  GameOver: undefined;
  Leaderboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export interface GameState {
  sessionId: string | null;
  playerName: string;
  currentScore: number;
  gameProgress: number;
  isPlaying: boolean;
  gameMetrics: {
    rhymeAccuracy: number;
    beatSyncAccuracy: number;
    toneMatchScore: number;
    reactionSpeedAvg: number;
  };
}

function App(): JSX.Element {
  const [gameState, setGameState] = useState<GameState>({
    sessionId: null,
    playerName: '',
    currentScore: 0,
    gameProgress: 0,
    isPlaying: false,
    gameMetrics: {
      rhymeAccuracy: 0,
      beatSyncAccuracy: 0,
      toneMatchScore: 0,
      reactionSpeedAvg: 0,
    },
  });

  const startGame = (playerName: string) => {
    setGameState(prev => ({
      ...prev,
      playerName,
      currentScore: 0,
      gameProgress: 0,
      isPlaying: true,
      gameMetrics: {
        rhymeAccuracy: 0,
        beatSyncAccuracy: 0,
        toneMatchScore: 0,
        reactionSpeedAvg: 0,
      },
    }));
  };

  const endGame = (finalMetrics: any) => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      gameMetrics: finalMetrics,
    }));
  };

  const resetGame = () => {
    setGameState({
      sessionId: null,
      playerName: '',
      currentScore: 0,
      gameProgress: 0,
      isPlaying: false,
      gameMetrics: {
        rhymeAccuracy: 0,
        beatSyncAccuracy: 0,
        toneMatchScore: 0,
        reactionSpeedAvg: 0,
      },
    });
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            initialParams={{ onStartGame: startGame, gameState }}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
            initialParams={{ gameState, setGameState, onEndGame: endGame }}
          />
          <Stack.Screen 
            name="GameOver" 
            component={GameOverScreen}
            initialParams={{ gameState, onPlayAgain: resetGame }}
          />
          <Stack.Screen 
            name="Leaderboard" 
            component={LeaderboardScreen}
            initialParams={{ onBack: resetGame }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App; 