import 'react-native-reanimated';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GameScreen } from './src/screens/GameScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { useRecords } from './src/hooks/useRecords';

import { MenuScreen } from './src/screens/MenuScreen';
import { Difficulty, DIFFICULTY_SETTINGS } from './src/types/game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'game' | 'records'>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const { records, saveRecord } = useRecords();

  const handleStartGame = (dif: Difficulty) => {
    setDifficulty(dif);
    setCurrentScreen('game');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'menu' && (
        <MenuScreen 
          onStart={handleStartGame} 
          onShowRecords={() => setCurrentScreen('records')} 
        />
      )}
      {currentScreen === 'game' && (
        <GameScreen 
          difficultyConfig={DIFFICULTY_SETTINGS[difficulty]}
          onWin={(time) => saveRecord(time, difficulty)}
          onBack={() => setCurrentScreen('menu')}
        />
      )}
      {currentScreen === 'records' && (
        <LeaderboardScreen 
          records={records} 
          onBack={() => setCurrentScreen('menu')} 
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
