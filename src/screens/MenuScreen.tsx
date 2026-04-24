import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Difficulty, DIFFICULTY_SETTINGS } from '../types/game';

interface MenuScreenProps {
  onStart: (difficulty: Difficulty) => void;
  onShowRecords: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onStart, onShowRecords }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'file:///Users/viniciusvibrich/work/personal/lhama-game/assets/icon.png' }} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Lhama Game</Text>
          <Text style={styles.subtitle}>Desafio dos Trios</Text>
        </View>

        <View style={styles.menu}>
          <Text style={styles.menuLabel}>Escolha a Dificuldade:</Text>
          
          {(['easy', 'medium', 'hard', 'impossible'] as Difficulty[]).map((dif) => (
            <TouchableOpacity
              key={dif}
              style={[styles.button, styles[dif]]}
              onPress={() => onStart(dif)}
            >
              <Text style={styles.buttonText}>{DIFFICULTY_SETTINGS[dif].label}</Text>
              <Text style={styles.buttonSubtext}>
                {DIFFICULTY_SETTINGS[dif].totalCards} cartas • Camadas: {DIFFICULTY_SETTINGS[dif].layers}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.recordButton} onPress={onShowRecords}>
            <Text style={styles.recordButtonText}>🏆 Ver Recordes</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Versão 1.1.0 • Made with 🦙</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#b8ff9e',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 15,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
  },
  menu: {
    width: '100%',
    maxWidth: 300,
  },
  menuLabel: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
    color: '#444',
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
  },
  easy: { backgroundColor: '#4caf50' },
  medium: { backgroundColor: '#2196f3' },
  hard: { backgroundColor: '#ff9800' },
  impossible: { backgroundColor: '#f44336' },
  recordButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  recordButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  footer: {
    color: '#666',
    fontSize: 12,
  },
});
