import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import axios from 'axios';

type LeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Leaderboard'>;

interface LeaderboardScreenProps {
  route: {
    params: {
      onBack: () => void;
    };
  };
}

interface LeaderboardEntry {
  player: string;
  score: number;
  accuracy: number;
}

const { width, height } = Dimensions.get('window');

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ route }) => {
  const { onBack } = route.params;
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<LeaderboardScreenNavigationProp>();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/leaderboard');
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
    navigation.navigate('Home');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank.toString();
    }
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) {
      return {
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
      };
    }
    if (rank === 2) {
      return {
        backgroundColor: 'rgba(192, 192, 192, 0.3)',
        borderColor: '#C0C0C0',
        shadowColor: '#C0C0C0',
      };
    }
    if (rank === 3) {
      return {
        backgroundColor: 'rgba(205, 127, 50, 0.3)',
        borderColor: '#CD7F32',
        shadowColor: '#CD7F32',
      };
    }
    return {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      shadowColor: 'transparent',
    };
  };

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) {
      return {
        backgroundColor: '#FFD700',
        shadowColor: '#FFD700',
      };
    }
    if (rank === 2) {
      return {
        backgroundColor: '#C0C0C0',
        shadowColor: '#C0C0C0',
      };
    }
    if (rank === 3) {
      return {
        backgroundColor: '#CD7F32',
        shadowColor: '#CD7F32',
      };
    }
    return {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: 'transparent',
    };
  };

  return (
    <LinearGradient colors={['#8B5CF6', '#A855F7', '#C084FC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>🏆 Leaderboard</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading leaderboard...</Text>
            </View>
          ) : (
            <View style={styles.leaderboardList}>
              {leaderboard.map((entry, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.leaderboardItem,
                    getRankStyle(index + 1),
                    {
                      opacity: new Animated.Value(0),
                      transform: [{ translateX: new Animated.Value(-20) }],
                    },
                  ]}
                  onLayout={() => {
                    Animated.parallel([
                      Animated.timing(new Animated.Value(0), {
                        toValue: 1,
                        duration: 300,
                        delay: index * 100,
                        useNativeDriver: true,
                      }),
                      Animated.timing(new Animated.Value(-20), {
                        toValue: 0,
                        duration: 300,
                        delay: index * 100,
                        useNativeDriver: true,
                      }),
                    ]).start();
                  }}
                >
                  <View style={[styles.rankBadge, getRankBadgeStyle(index + 1)]}>
                    <Text style={styles.rankText}>{getRankIcon(index + 1)}</Text>
                  </View>
                  
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{entry.player}</Text>
                    <Text style={styles.playerAccuracy}>
                      {Math.round(entry.accuracy * 100)}% accuracy
                    </Text>
                  </View>
                  
                  <Text style={styles.playerScore}>
                    {entry.score.toLocaleString()}
                  </Text>
                </Animated.View>
              ))}
            </View>
          )}
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>🏠 Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 30,
    width: '100%',
    maxWidth: 500,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    opacity: 0.8,
  },
  leaderboardList: {
    width: '100%',
    marginVertical: 30,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  rankText: {
    fontWeight: '700',
    fontSize: 16,
    color: 'white',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerName: {
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  playerAccuracy: {
    fontSize: 12,
    opacity: 0.8,
    color: 'white',
  },
  playerScore: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 48,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LeaderboardScreen; 