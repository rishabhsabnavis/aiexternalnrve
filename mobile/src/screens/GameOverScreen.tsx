import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type GameOverScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameOver'>;

interface GameOverScreenProps {
  route: {
    params: {
      gameState: any;
      onPlayAgain: () => void;
    };
  };
}

const { width, height } = Dimensions.get('window');

const GameOverScreen: React.FC<GameOverScreenProps> = ({ route }) => {
  const { gameState, onPlayAgain } = route.params;
  const navigation = useNavigation<GameOverScreenNavigationProp>();
  
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
    navigation.navigate('Home');
  };
  
  const handleLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };
  
  const handleHome = () => {
    onPlayAgain();
    navigation.navigate('Home');
  };

  return (
    <LinearGradient colors={['#8B5CF6', '#A855F7', '#C084FC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Game Over!</Text>
          
          <Text style={styles.scoreDisplay}>
            {gameState.currentScore}
          </Text>
          
          <Text style={[styles.performanceMessage, { color: getPerformanceLevel() === 'excellent' ? '#4CAF50' : 
                                                      getPerformanceLevel() === 'good' ? '#2196F3' :
                                                      getPerformanceLevel() === 'average' ? '#FF9800' : '#F44336' }]}>
            {getPerformanceMessage()}
          </Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                {formatMetric(gameState.gameMetrics.rhymeAccuracy, 'percentage')}
              </Text>
              <Text style={styles.metricLabel}>Rhyme Accuracy</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                {formatMetric(gameState.gameMetrics.beatSyncAccuracy, 'percentage')}
              </Text>
              <Text style={styles.metricLabel}>Beat Sync</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                {formatMetric(gameState.gameMetrics.toneMatchScore, 'percentage')}
              </Text>
              <Text style={styles.metricLabel}>Tone Match</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                {formatMetric(gameState.gameMetrics.reactionSpeedAvg, 'time')}
              </Text>
              <Text style={styles.metricLabel}>Reaction Speed</Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePlayAgain}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>🎮 Play Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleLeaderboard}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>🏆 Leaderboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleHome}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>🏠 Home</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  scoreDisplay: {
    fontSize: width * 0.12,
    fontWeight: '700',
    color: '#4CAF50',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  performanceMessage: {
    fontSize: width * 0.04,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 30,
  },
  metricItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#4CAF50',
  },
  metricLabel: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
  },
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 48,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 48,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GameOverScreen; 