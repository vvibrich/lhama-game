import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card as CardType } from '../types/game';
import { Card } from './Card';

interface StackProps {
  cards: CardType[];
  index: number;
  onPress: (index: number) => void;
  selectable?: boolean;
}

export const Stack: React.FC<StackProps> = ({ cards, index, onPress, selectable }) => {
  const topCard = cards.length > 0 ? cards[cards.length - 1] : null;

  return (
    <View style={styles.container}>
      {topCard ? (
        <Card 
          value={topCard.value} 
          onPress={() => onPress(index)}
          highlighted={selectable}
        />
      ) : (
        <View style={styles.empty} />
      )}
      {cards.length > 1 && (
        <Text style={styles.count}>{cards.length}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 4,
  },
  empty: {
    width: 48,
    height: 64,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  count: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  }
});
