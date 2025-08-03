import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import LeaderboardScreen from './components/LeaderboardScreen';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

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

function App() {
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
    <Router>
      <AppContainer>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomeScreen 
                onStartGame={startGame}
                gameState={gameState}
              />
            } 
          />
          <Route 
            path="/game" 
            element={
              <GameScreen 
                gameState={gameState}
                setGameState={setGameState}
                onEndGame={endGame}
              />
            } 
          />
          <Route 
            path="/game-over" 
            element={
              <GameOverScreen 
                gameState={gameState}
                onPlayAgain={resetGame}
              />
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <LeaderboardScreen 
                onBack={resetGame}
              />
            } 
          />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App; 