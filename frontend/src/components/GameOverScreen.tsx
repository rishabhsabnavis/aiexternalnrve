import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GameOverContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%);
  position: relative;
  overflow: hidden;
`;

const GameOverContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  color: white;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  margin: 0 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const ScoreDisplay = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #4CAF50;
  margin: 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MetricItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4CAF50;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
`;

const SecondaryButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const PerformanceMessage = styled.div<{ performance: string }>`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1rem 0;
  color: ${props => {
    switch (props.performance) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#2196F3';
      case 'average': return '#FF9800';
      case 'poor': return '#F44336';
      default: return 'white';
    }
  }};
`;

interface GameOverScreenProps {
  gameState: any;
  onPlayAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ gameState, onPlayAgain }) => {
  const navigate = useNavigate();
  
  const getPerformanceLevel = () => {
    const avgScore = (gameState.gameMetrics.rhymeAccuracy + gameState.gameMetrics.beatSyncAccuracy) / 2;
    if (avgScore > 0.8) return 'excellent';
    if (avgScore > 0.6) return 'good';
    if (avgScore > 0.4) return 'average';
    return 'poor';
  };
  
  const getPerformanceMessage = () => {
    const level = getPerformanceLevel();
    switch (level) {
      case 'excellent':
        return '🔥 Amazing! You have perfect rhythm!';
      case 'good':
        return '👍 Great job! Your flow is on point!';
      case 'average':
        return '⚠️ Not bad! Keep practicing to improve!';
      case 'poor':
        return '💪 Keep trying! Rhythm takes practice!';
      default:
        return '🎵 Thanks for playing!';
    }
  };
  
  const formatMetric = (value: number, type: string) => {
    if (type === 'percentage') {
      return `${Math.round(value * 100)}%`;
    }
    if (type === 'time') {
      return `${Math.round(value)}ms`;
    }
    return Math.round(value * 100) / 100;
  };
  
  const handlePlayAgain = () => {
    onPlayAgain();
    navigate('/');
  };
  
  const handleLeaderboard = () => {
    navigate('/leaderboard');
  };
  
  const handleHome = () => {
    onPlayAgain();
    navigate('/');
  };

  return (
    <GameOverContainer>
      <GameOverContent
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Title>Game Over!</Title>
        
        <ScoreDisplay>
          {gameState.currentScore}
        </ScoreDisplay>
        
        <PerformanceMessage performance={getPerformanceLevel()}>
          {getPerformanceMessage()}
        </PerformanceMessage>
        
        <MetricsGrid>
          <MetricItem>
            <MetricValue>
              {formatMetric(gameState.gameMetrics.rhymeAccuracy, 'percentage')}
            </MetricValue>
            <MetricLabel>Rhyme Accuracy</MetricLabel>
          </MetricItem>
          
          <MetricItem>
            <MetricValue>
              {formatMetric(gameState.gameMetrics.beatSyncAccuracy, 'percentage')}
            </MetricValue>
            <MetricLabel>Beat Sync</MetricLabel>
          </MetricItem>
          
          <MetricItem>
            <MetricValue>
              {formatMetric(gameState.gameMetrics.toneMatchScore, 'percentage')}
            </MetricValue>
            <MetricLabel>Tone Match</MetricLabel>
          </MetricItem>
          
          <MetricItem>
            <MetricValue>
              {formatMetric(gameState.gameMetrics.reactionSpeedAvg, 'time')}
            </MetricValue>
            <MetricLabel>Reaction Speed</MetricLabel>
          </MetricItem>
        </MetricsGrid>
        
        <ButtonContainer>
          <Button
            onClick={handlePlayAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🎮 Play Again
          </Button>
          
          <SecondaryButton
            onClick={handleLeaderboard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🏆 Leaderboard
          </SecondaryButton>
          
          <SecondaryButton
            onClick={handleHome}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🏠 Home
          </SecondaryButton>
        </ButtonContainer>
      </GameOverContent>
    </GameOverContainer>
  );
};

export default GameOverScreen; 