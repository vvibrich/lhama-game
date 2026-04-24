import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card as CardType } from '../types/game';
import { Card } from './Card';

interface BenchProps {
  cards: CardType[];
  maxSlots: number;
}

export const Bench: React.FC<BenchProps> = ({ cards, maxSlots }) => {
  const slots = Array(maxSlots).fill(null);

  return (
    <View style={styles.container}>
      {slots.map((_, i) => (
        <View key={i} style={styles.slot}>
          {cards[i] && <Card value={cards[i].value} disabled />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee',
    justifyContent: 'center',
    width: '100%',
    minHeight: 90,
  },
  slot: {
    width: 42,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  }
});
