import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import axios from 'axios';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;

interface GameScreenProps {
  route: {
    params: {
      gameState: any;
      setGameState: (state: any) => void;
      onEndGame: (metrics: any) => void;
    };
  };
}

interface LyricData {
  lyric_id: string;
  lyric_text: string;
  options: string[];
  correct_rhyme: string;
  beat_timing: number;
  session_id: string;
}

const { width, height } = Dimensions.get('window');

const GameScreen: React.FC<GameScreenProps> = ({ route }) => {
  const { gameState, setGameState, onEndGame } = route.params;
  const [currentLyric, setCurrentLyric] = useState<LyricData | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [activeBeat, setActiveBeat] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameProgress, setGameProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [choices, setChoices] = useState<any[]>([]);
  
  const navigation = useNavigation<GameScreenNavigationProp>();
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const beatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string>('');
  const [beatAnimations] = useState([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]);

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
      const response = await axios.post('http://localhost:8000/game/start', {
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
        setActiveBeat(prev => {
          const newBeat = (prev + 1) % 4;
          
          // Animate the active beat
          Animated.sequence([
            Animated.timing(beatAnimations[newBeat], {
              toValue: 1.5,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(beatAnimations[newBeat], {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          
          return newBeat;
        });
      }, 600);
      
    } catch (error) {
      console.error('Failed to start game:', error);
      Alert.alert('Error', 'Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWordSelection = async (word: string) => {
    if (!currentLyric || selectedWord) return;
    
    setSelectedWord(word);
    const tapTimestamp = Date.now();
    const beatTimestamp = Date.now() + (activeBeat * 150);
    
    try {
      const response = await axios.post('http://localhost:8000/game/choice', {
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
      setGameProgress(prev => Math.min(prev + 8.33, 100));
      
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
      
      await axios.post('http://localhost:8000/game/end', {
        session_id: sessionIdRef.current,
        total_score: gameState.currentScore,
        final_metrics: finalMetrics
      });
      
      onEndGame(finalMetrics);
      navigation.navigate('GameOver');
      
    } catch (error) {
      console.error('Failed to end game:', error);
      navigation.navigate('GameOver');
    }
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#8B5CF6', '#A855F7', '#C084FC']} style={styles.container}>
        <Text style={styles.loadingText}>Loading game...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#8B5CF6', '#A855F7', '#C084FC']} style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${gameProgress}%` }]} />
      </View>
      
      <Text style={styles.timer}>{timeLeft}s</Text>
      <Text style={styles.scoreDisplay}>Score: {gameState.currentScore}</Text>
      
      {currentLyric && (
        <View style={styles.lyricContainer}>
          <Text style={styles.lyricText}>{currentLyric.lyric_text}</Text>
          
          <View style={styles.wordOptions}>
            {currentLyric.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.wordOption,
                  selectedWord === option && option === currentLyric.correct_rhyme && styles.wordOptionCorrect,
                  selectedWord === option && option !== currentLyric.correct_rhyme && styles.wordOptionIncorrect,
                ]}
                onPress={() => handleWordSelection(option)}
                disabled={selectedWord !== null}
                activeOpacity={0.8}
              >
                <Text style={styles.wordOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.beatGrid}>
        {[0, 1, 2, 3].map((beat) => (
          <Animated.View
            key={beat}
            style={[
              styles.beatPulse,
              {
                transform: [{ scale: beatAnimations[beat] }],
                backgroundColor: beat === activeBeat ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                shadowColor: beat === activeBeat ? '#fff' : 'transparent',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: beat === activeBeat ? 0.8 : 0,
                shadowRadius: beat === activeBeat ? 10 : 0,
                elevation: beat === activeBeat ? 5 : 0,
              },
            ]}
          />
        ))}
      </View>
      
      {feedback && (
        <Animated.View
          style={[
            styles.feedback,
            {
              backgroundColor: feedbackType === 'green' ? 'rgba(76, 175, 80, 0.9)' :
                           feedbackType === 'blue' ? 'rgba(33, 150, 243, 0.9)' :
                           feedbackType === 'yellow' ? 'rgba(255, 152, 0, 0.9)' :
                           feedbackType === 'red' ? 'rgba(244, 67, 54, 0.9)' :
                           'rgba(0, 0, 0, 0.8)',
            },
          ]}
        >
          <Text style={styles.feedbackText}>{feedback}</Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  timer: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 8,
    color: 'white',
    fontWeight: '600',
  },
  scoreDisplay: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 8,
    color: 'white',
    fontWeight: '600',
  },
  lyricContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    maxWidth: 500,
  },
  lyricText: {
    fontSize: width * 0.06,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  wordOptions: {
    width: '100%',
    maxWidth: 300,
  },
  wordOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  wordOptionCorrect: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
  },
  wordOptionIncorrect: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: '#F44336',
  },
  wordOptionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  beatGrid: {
    position: 'absolute',
    bottom: height * 0.2,
    flexDirection: 'row',
    gap: 8,
  },
  beatPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  feedback: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
});

export default GameScreen; 