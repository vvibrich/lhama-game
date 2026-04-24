import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  withRepeat, 
  withSequence,
  runOnJS,
  Easing
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LlamaStampedeProps {
  onComplete: () => void;
}

const SingleLlama = ({ top, delay, duration, onLlamaDone }: { 
  top: number; 
  delay: number; 
  duration: number;
  onLlamaDone: () => void;
}) => {
  const translateX = useSharedValue(-150);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Forward movement
    translateX.value = withDelay(
      delay,
      withTiming(SCREEN_WIDTH + 150, { 
        duration, 
        easing: Easing.linear 
      }, (finished) => {
        if (finished) {
          runOnJS(onLlamaDone)();
        }
      })
    );

    // Gallop oscillation (jumping effect)
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: 150 }),
          withTiming(0, { duration: 150 })
        ),
        -1,
        true
      )
    );

    // Slight rotation during gallop
    rotation.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 150 }),
          withTiming(10, { duration: 150 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  return (
    <Animated.View style={[styles.llamaWrapper, { top }, animatedStyle]}>
      <Text style={styles.llamaEmoji}>🦙</Text>
      <Text style={[styles.llamaEmoji, { fontSize: 40, marginTop: 10 }]}>🦙</Text>
      <Text style={styles.llamaEmoji}>🦙</Text>
    </Animated.View>
  );
};

export const LlamaStampede: React.FC<LlamaStampedeProps> = ({ onComplete }) => {
  const llamasDone = React.useRef(0);
  const totalLlamas = 6;

  const handleLlamaDone = () => {
    llamasDone.current += 1;
    if (llamasDone.current === totalLlamas) {
      onComplete();
    }
  };

  const llamaRows = [100, 220, 340, 460, 580, 700];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {llamaRows.map((top, index) => (
        <SingleLlama 
          key={index}
          top={top}
          delay={index * 150} // Staggered entry
          duration={1800 + Math.random() * 400} // Slightly different speeds
          onLlamaDone={handleLlamaDone}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  llamaWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  llamaEmoji: {
    fontSize: 55,
    marginRight: -25,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 2,
  },
});
