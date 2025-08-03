import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  route: {
    params: {
      onStartGame: (playerName: string) => void;
      gameState: any;
    };
  };
}

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ route }) => {
  const { onStartGame, gameState } = route.params;
  const [playerName, setPlayerName] = useState('');
  const [activeBeat, setActiveBeat] = useState(0);
  const [beatAnimations] = useState([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]);
  
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Animate beat grid
  useEffect(() => {
    const interval = setInterval(() => {
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

    return () => clearInterval(interval);
  }, [beatAnimations]);

  const handleStartGame = () => {
    if (playerName.trim()) {
      onStartGame(playerName.trim());
      navigation.navigate('Game');
    }
  };

  const handleLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  return (
    <LinearGradient
      colors={['#8B5CF6', '#A855F7', '#C084FC']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.Text
          style={[styles.title, { opacity: new Animated.Value(0) }]}
          onLayout={() => {
            Animated.timing(new Animated.Value(0), {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }).start();
          }}
        >
          🎮 Rhyme Racer
        </Animated.Text>
        
        <Text style={styles.subtitle}>
          Tap rhyming words in rhythm to race across the music highway!
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your name..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
            autoCapitalize="words"
          />
          
          <TouchableOpacity
            style={[
              styles.button,
              !playerName.trim() && styles.buttonDisabled
            ]}
            onPress={handleStartGame}
            disabled={!playerName.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>🚀 Start Racing!</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLeaderboard}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>🏆 Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
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
  subtitle: {
    fontSize: width * 0.04,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 60,
    maxWidth: 400,
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 30,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 24,
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
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    minHeight: 48,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
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
});

export default HomeScreen; 