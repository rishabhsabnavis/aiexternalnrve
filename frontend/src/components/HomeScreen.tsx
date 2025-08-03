import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HomeContainer = styled.div`
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

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 3rem;
  max-width: 400px;
  line-height: 1.5;
`;

const FormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
  margin: 0 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.2);
  }
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
  margin-bottom: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
    transform: none;
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
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const BeatGrid = styled.div`
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`;

const BeatPulse = styled.div<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.3)'};
  box-shadow: ${props => props.active ? '0 0 20px rgba(255, 255, 255, 0.8)' : 'none'};
  transform: ${props => props.active ? 'scale(1.5)' : 'scale(1)'};
  transition: all 0.1s ease;
`;

interface HomeScreenProps {
  onStartGame: (playerName: string) => void;
  gameState: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, gameState }) => {
  const [playerName, setPlayerName] = useState('');
  const [activeBeat, setActiveBeat] = useState(0);
  const navigate = useNavigate();

  // Animate beat grid
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveBeat(prev => (prev + 1) % 4);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleStartGame = () => {
    if (playerName.trim()) {
      onStartGame(playerName.trim());
      navigate('/game');
    }
  };

  const handleLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <HomeContainer>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🎮 Rhyme Racer
      </Title>
      
      <Subtitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Tap rhyming words in rhythm to race across the music highway!
      </Subtitle>

      <FormContainer
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Input
          type="text"
          placeholder="Enter your name..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
          maxLength={20}
        />
        
        <Button
          onClick={handleStartGame}
          disabled={!playerName.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🚀 Start Racing!
        </Button>
        
        <SecondaryButton
          onClick={handleLeaderboard}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🏆 Leaderboard
        </SecondaryButton>
      </FormContainer>

      <BeatGrid>
        {[0, 1, 2, 3].map((beat) => (
          <BeatPulse key={beat} active={beat === activeBeat} />
        ))}
      </BeatGrid>
    </HomeContainer>
  );
};

export default HomeScreen; 