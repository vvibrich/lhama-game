import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { GameRecord, RecordsByDifficulty, Difficulty, DIFFICULTY_SETTINGS } from '../types/game';

interface LeaderboardScreenProps {
  records: RecordsByDifficulty;
  onBack: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ records, onBack }) => {
  const [selectedDif, setSelectedDif] = useState<Difficulty>('medium');

  const diffs: Difficulty[] = ['easy', 'medium', 'hard', 'impossible'];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Recordes 🏆</Text>
        </View>

        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {diffs.map(dif => (
              <TouchableOpacity 
                key={dif}
                style={[styles.tab, selectedDif === dif && styles.tabActive]}
                onPress={() => setSelectedDif(dif)}
              >
                <Text style={[styles.tabText, selectedDif === dif && styles.tabTextActive]}>
                  {DIFFICULTY_SETTINGS[dif].label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 1 }]}>Pos</Text>
          <Text style={[styles.headerText, { flex: 3 }]}>Data</Text>
          <Text style={[styles.headerText, { flex: 2 }]}>Tempo</Text>
        </View>

        <FlatList
          data={records[selectedDif] || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, { flex: 1 }]}>{index + 1}º</Text>
              <Text style={[styles.cell, { flex: 3 }]}>{item.date}</Text>
              <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>{formatTime(item.time)}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum recorde nesta dificuldade. Vença o jogo!</Text>
          }
        />

        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  tabActive: {
    backgroundColor: '#4caf50',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cell: {
    fontSize: 16,
    color: '#444',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
