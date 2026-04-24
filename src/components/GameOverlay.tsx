import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GameStatus } from "../types/game";

interface GameOverlayProps {
  status: GameStatus;
  onRestart: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  status,
  onRestart,
}) => {
  if (status === "playing" || status === "llama_selection") return null;

  const isWin = status === "win";

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>
          {isWin ? "🏆 VOCÊ VENCEU!" : "💀 GAME OVER"}
        </Text>
        <Text style={styles.subtitle}>
          {isWin
            ? "Parabéns! Você eliminou todas as cartas."
            : "Sua bancada atingiu o limite da sua bancada."}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onRestart}>
          <Text style={styles.buttonText}>JOGAR NOVAMENTE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
