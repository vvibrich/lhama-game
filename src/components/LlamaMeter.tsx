import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

interface LlamaMeterProps {
  points: number;
  maxPoints: number;
  onActivate: () => void;
  isReady: boolean;
}

export const LlamaMeter: React.FC<LlamaMeterProps> = ({
  points,
  maxPoints,
  onActivate,
  isReady,
}) => {
  const progress = Math.min(1, points / maxPoints);

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${progress * 100}%` }]} />
        <Text style={styles.pointsText}>
          💎 {points} / {maxPoints}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onActivate}
        disabled={!isReady}
        style={[
          styles.button,
          isReady ? styles.buttonActive : styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>🦙 CHAMAR LHAMA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    alignItems: "center",
  },
  barContainer: {
    width: "100%",
    height: 30,
    backgroundColor: "#eee",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    justifyContent: "center",
  },
  bar: {
    height: "100%",
    backgroundColor: "#9c27b0", // Llama purple
  },
  pointsText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
    color: "#333",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonActive: {
    backgroundColor: "#9c27b0",
  },
  buttonDisabled: {
    backgroundColor: "#bdbdbd",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
