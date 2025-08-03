import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const GameContainer = styled.div`
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

const ProgressContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #2196F3);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.3);
  padding: 12px 16px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  backdrop-filter: blur(10px);
`;

const LyricContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
  max-width: 500px;
`;

const LyricText = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const WordOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
`;

const WordOption = styled(motion.button)<{ isCorrect?: boolean; isIncorrect?: boolean }>`
  background: ${props => {
    if (props.isCorrect) return 'rgba(76, 175, 80, 0.3)';
    if (props.isIncorrect) return 'rgba(244, 67, 54, 0.3)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  border: 2px solid ${props => {
    if (props.isCorrect) return '#4CAF50';
    if (props.isIncorrect) return '#F44336';
    return 'rgba(255, 255, 255, 0.3)';
  }};
  border-radius: 12px;
  padding: 16px 20px;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
    background: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 14px 16px;
    min-height: 50px;
  }
`;

const BeatGrid = styled.div`
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
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

const Feedback = styled(motion.div)<{ type: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: 700;
  color: ${props => {
    switch (props.type) {
      case 'perfect': return '#4CAF50';
      case 'good': return '#2196F3';
      case 'warning': return '#FF9800';
      case 'poor': return '#F44336';
      default: return 'white';
    }
  }};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 100;
  pointer-events: none;
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Timer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.3);
  padding: 12px 16px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  backdrop-filter: blur(10px);
`;

interface GameScreenProps {
  gameState: any;
  setGameState: (state: any) => void;
  onEndGame: (metrics: any) => void;
}

interface LyricData {
  lyric_id: string;
  lyric_text: string;
  options: string[];
  correct_rhyme: string;
  beat_timing: number;
  session_id: string;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, setGameState, onEndGame }) => {
  const [currentLyric, setCurrentLyric] = useState<LyricData | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [activeBeat, setActiveBeat] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameProgress, setGameProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [choices, setChoices] = useState<any[]>([]);
  
  const navigate = useNavigate();
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const beatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string>('');

  // Initialize game
  useEffect(() => {
    startNewGame();
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
    };
  }, []);

  const startNewGame = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/game/start', {
        player_name: gameState.playerName,
        difficulty: 'medium'
      });
      
      const gameData = response.data;
      sessionIdRef.current = gameData.session_id;
      setCurrentLyric(gameData);
      
      // Start game timer
      gameTimerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Start beat timer
      beatTimerRef.current = setInterval(() => {
        setActiveBeat(prev => (prev + 1) % 4);
      }, 600);
      
    } catch (error) {
      console.error('Failed to start game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWordSelection = async (word: string) => {
    if (!currentLyric || selectedWord) return;
    
    setSelectedWord(word);
    const tapTimestamp = Date.now();
    const beatTimestamp = Date.now() + (activeBeat * 150); // Approximate beat timing
    
    try {
      const response = await axios.post('/game/choice', {
        session_id: sessionIdRef.current,
        lyric_id: currentLyric.lyric_id,
        chosen_word: word,
        tap_timestamp: tapTimestamp,
        beat_timestamp: beatTimestamp
      });
      
      const { feedback: feedbackData, metrics, speed_boost } = response.data;
      
      // Store choice data
      const choiceData = {
        lyric_id: currentLyric.lyric_id,
        chosen_word: word,
        tap_timestamp: tapTimestamp,
        beat_timestamp: beatTimestamp,
        ...metrics
      };
      setChoices(prev => [...prev, choiceData]);
      
      // Update score
      const scoreIncrease = Math.round(metrics.rhyme_accuracy * 100 + metrics.beat_accuracy * 50);
      setGameState(prev => ({
        ...prev,
        currentScore: prev.currentScore + scoreIncrease
      }));
      
      // Show feedback
      setFeedback(feedbackData.message);
      setFeedbackType(feedbackData.color);
      
      // Update progress
      setGameProgress(prev => Math.min(prev + 8.33, 100)); // 12 lyrics total
      
      // Clear feedback after delay
      setTimeout(() => {
        setFeedback('');
        setSelectedWord(null);
        loadNextLyric();
      }, 1500);
      
    } catch (error) {
      console.error('Failed to submit choice:', error);
      setSelectedWord(null);
    }
  };

  const loadNextLyric = async () => {
    try {
      // For demo purposes, cycle through predefined lyrics
      const lyrics = [
        {
          lyric_id: 'lyric_1',
          lyric_text: "I'm moving fast like a flash of ___",
          options: ["trash", "cash", "dash"],
          correct_rhyme: "dash",
          beat_timing: 1.0,
          session_id: sessionIdRef.current
        },
        {
          lyric_id: 'lyric_2',
          lyric_text: "The rhythm flows like a river of ___",
          options: ["gold", "soul", "flow"],
          correct_rhyme: "flow",
          beat_timing: 1.2,
          session_id: sessionIdRef.current
        },
        {
          lyric_id: 'lyric_3',
          lyric_text: "My words hit hard like a hammer of ___",
          options: ["steel", "feel", "real"],
          correct_rhyme: "steel",
          beat_timing: 0.8,
          session_id: sessionIdRef.current
        }
      ];
      
      const nextLyricIndex = Math.floor(Math.random() * lyrics.length);
      setCurrentLyric(lyrics[nextLyricIndex]);
      
    } catch (error) {
      console.error('Failed to load next lyric:', error);
    }
  };

  const endGame = async () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (beatTimerRef.current) clearInterval(beatTimerRef.current);
    
    try {
      // Calculate final metrics
      const finalMetrics = {
        rhyme_accuracy_score: choices.reduce((sum, choice) => sum + choice.rhyme_accuracy, 0) / Math.max(choices.length, 1),
        beat_sync_accuracy: choices.reduce((sum, choice) => sum + choice.beat_accuracy, 0) / Math.max(choices.length, 1),
        tone_match_score: choices.reduce((sum, choice) => sum + choice.tone_score, 0) / Math.max(choices.length, 1),
        reaction_speed_avg: choices.reduce((sum, choice) => sum + choice.timing_offset, 0) / Math.max(choices.length, 1)
      };
      
      await axios.post('/game/end', {
        session_id: sessionIdRef.current,
        total_score: gameState.currentScore,
        final_metrics: finalMetrics
      });
      
      onEndGame(finalMetrics);
      navigate('/game-over');
      
    } catch (error) {
      console.error('Failed to end game:', error);
      navigate('/game-over');
    }
  };

  if (isLoading) {
    return (
      <GameContainer>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>
          Loading game...
        </div>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <ProgressContainer>
        <ProgressBar progress={gameProgress} />
      </ProgressContainer>
      
      <Timer>{timeLeft}s</Timer>
      <ScoreDisplay>Score: {gameState.currentScore}</ScoreDisplay>
      
      {currentLyric && (
        <>
          <LyricContainer>
            <LyricText
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentLyric.lyric_text}
            </LyricText>
            
            <WordOptions>
              {currentLyric.options.map((option, index) => (
                <WordOption
                  key={index}
                  onClick={() => handleWordSelection(option)}
                  disabled={selectedWord !== null}
                  isCorrect={selectedWord === option && option === currentLyric.correct_rhyme}
                  isIncorrect={selectedWord === option && option !== currentLyric.correct_rhyme}
                  whileHover={{ scale: selectedWord ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </WordOption>
              ))}
            </WordOptions>
          </LyricContainer>
        </>
      )}
      
      <BeatGrid>
        {[0, 1, 2, 3].map((beat) => (
          <BeatPulse key={beat} active={beat === activeBeat} />
        ))}
      </BeatGrid>
      
      <AnimatePresence>
        {feedback && (
          <Feedback
            type={feedbackType}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            {feedback}
          </Feedback>
        )}
      </AnimatePresence>
    </GameContainer>
  );
};

export default GameScreen; 