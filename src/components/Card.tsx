import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

interface CardProps {
  value: string;
  onPress?: () => void;
  disabled?: boolean;
  highlighted?: boolean;
  blocked?: boolean;
}

export const Card: React.FC<CardProps> = ({ value, onPress, disabled, highlighted, blocked }) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled || blocked}
        style={[
          styles.container,
          highlighted && styles.highlighted,
          disabled && !highlighted && styles.disabled,
          blocked && styles.blocked
        ]}
      >
        <Text style={styles.text}>{value}</Text>
        {blocked && <View style={styles.overlay} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  text: {
    fontSize: 22,
  },
  highlighted: {
    borderColor: '#FFD700',
    borderWidth: 3,
    backgroundColor: '#FFFACD',
  },
  disabled: {
    opacity: 0.8,
    backgroundColor: '#f5f5f5',
  },
  blocked: {
    backgroundColor: '#a0a0a0',
    borderColor: '#888',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
  }
});
