import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';

const LeaderboardContainer = styled.div`
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

const LeaderboardContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  color: white;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  margin: 0 1rem;
  max-height: 80vh;
  overflow-y: auto;
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

const LeaderboardList = styled.div`
  margin: 2rem 0;
`;

const LeaderboardItem = styled(motion.div)<{ rank: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  ${props => {
    if (props.rank === 1) {
      return `
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 193, 7, 0.3) 100%);
        border-color: #FFD700;
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
      `;
    }
    if (props.rank === 2) {
      return `
        background: linear-gradient(135deg, rgba(192, 192, 192, 0.3) 0%, rgba(169, 169, 169, 0.3) 100%);
        border-color: #C0C0C0;
        box-shadow: 0 4px 12px rgba(192, 192, 192, 0.3);
      `;
    }
    if (props.rank === 3) {
      return `
        background: linear-gradient(135deg, rgba(205, 127, 50, 0.3) 0%, rgba(184, 115, 51, 0.3) 100%);
        border-color: #CD7F32;
        box-shadow: 0 4px 12px rgba(205, 127, 50, 0.3);
      `;
    }
    return '';
  }}
`;

const RankBadge = styled.div<{ rank: number }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: white;
  
  ${props => {
    if (props.rank === 1) {
      return `
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
      `;
    }
    if (props.rank === 2) {
      return `
        background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
        box-shadow: 0 2px 8px rgba(192, 192, 192, 0.5);
      `;
    }
    if (props.rank === 3) {
      return `
        background: linear-gradient(135deg, #CD7F32 0%, #B87333 100%);
        box-shadow: 0 2px 8px rgba(205, 127, 50, 0.5);
      `;
    }
    return `
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
    `;
  }}
`;

const PlayerInfo = styled.div`
  flex: 1;
  text-align: left;
  margin-left: 1rem;
`;

const PlayerName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const PlayerScore = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4CAF50;
`;

const PlayerAccuracy = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
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
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
`;

interface LeaderboardEntry {
  player: string;
  score: number;
  accuracy: number;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/leaderboard');
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      // Fallback to mock data
      setLeaderboard([
        { player: "RhymeMaster", score: 9500, accuracy: 0.92 },
        { player: "BeatBuster", score: 8900, accuracy: 0.88 },
        { player: "FlowKing", score: 8200, accuracy: 0.85 },
        { player: "WordSmith", score: 7800, accuracy: 0.82 },
        { player: "RhythmRider", score: 7400, accuracy: 0.79 },
        { player: "LyricLegend", score: 7000, accuracy: 0.76 },
        { player: "BeatBreaker", score: 6600, accuracy: 0.73 },
        { player: "FlowFinder", score: 6200, accuracy: 0.70 },
        { player: "WordWizard", score: 5800, accuracy: 0.67 },
        { player: "RhymeRunner", score: 5400, accuracy: 0.64 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    onBack();
    navigate('/');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank.toString();
    }
  };

  return (
    <LeaderboardContainer>
      <LeaderboardContent
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Title>🏆 Leaderboard</Title>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <LoadingSpinner />
            <div style={{ marginTop: '1rem', opacity: 0.8 }}>
              Loading leaderboard...
            </div>
          </div>
        ) : (
          <LeaderboardList>
            {leaderboard.map((entry, index) => (
              <LeaderboardItem
                key={index}
                rank={index + 1}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <RankBadge rank={index + 1}>
                  {getRankIcon(index + 1)}
                </RankBadge>
                
                <PlayerInfo>
                  <PlayerName>{entry.player}</PlayerName>
                  <PlayerAccuracy>
                    {Math.round(entry.accuracy * 100)}% accuracy
                  </PlayerAccuracy>
                </PlayerInfo>
                
                <PlayerScore>
                  {entry.score.toLocaleString()}
                </PlayerScore>
              </LeaderboardItem>
            ))}
          </LeaderboardList>
        )}
        
        <Button
          onClick={handleBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🏠 Back to Home
        </Button>
      </LeaderboardContent>
    </LeaderboardContainer>
  );
};

export default LeaderboardScreen; 