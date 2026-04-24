import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useGame } from "../hooks/useGame";
import { Card } from "../components/Card";
import { Bench } from "../components/Bench";
import { LlamaMeter } from "../components/LlamaMeter";
import { GameOverlay } from "../components/GameOverlay";
import { isCardBlocked } from "../engine/gameLogic";
import { LlamaStampede } from '../components/LlamaStampede';
import { DifficultyConfig } from '../types/game';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const GameScreen: React.FC<{
  difficultyConfig: DifficultyConfig;
  onWin: (time: number) => void;
  onBack: () => void;
}> = ({ difficultyConfig, onWin, onBack }) => {
  const {
    state,
    elapsedTime,
    onPickCard,
    onRestart,
    onActivateLlama,
    onUseLlama,
  } = useGame(difficultyConfig, onWin);
  const [showStampede, setShowStampede] = React.useState(false);

  const totalInitialCards = difficultyConfig.totalCards;
  const currentCards = state.table.length + state.board.length;
  const eliminatedCards = totalInitialCards - currentCards;
  const progressPercent = Math.floor(
    (eliminatedCards / totalInitialCards) * 100,
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCardPress = (id: string) => {
    if (state.status === "llama_selection") {
      setShowStampede(true);
      // Actual removal happens after a short delay so it looks like llamas "ate" them
      setTimeout(() => {
        onUseLlama(id);
      }, 800);
    } else {
      onPickCard(id);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header with Avatar and Timer */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.recordButtonText}>⬅️ Voltar</Text>
          </TouchableOpacity>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>⏱️ {formatTime(elapsedTime)}</Text>
          </View>

          <View style={styles.headerCenter}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: "file:///Users/viniciusvibrich/work/personal/lhama-game/assets/icon.png",
                }}
                style={styles.avatar}
              />
              <View style={styles.avatarBadge}>
                <Text style={styles.badgeText}>{progressPercent}%</Text>
              </View>
            </View>
            <Text style={styles.userName}>Vinicius ...</Text>
          </View>
        </View>

        {state.status === "llama_selection" && (
          <View style={styles.instructionContainer}>
            <Text style={styles.llamaInstruction}>
              ESCOLHA UMA CARTA PARA ELIMINAR O CLUSTER!
            </Text>
          </View>
        )}

        {/* Table Area (Absolute Positioning) */}
        <View style={styles.tableArea}>
          <View style={styles.tableInner}>
            {state.table.map((card) => (
              <View
                key={card.id}
                style={[
                  styles.cardWrapper,
                  {
                    left: card.x,
                    top: card.y,
                    zIndex: card.layer * 10,
                  },
                ]}
              >
                <Card
                  value={card.value}
                  onPress={() => handleCardPress(card.id)}
                  blocked={isCardBlocked(card, state.table)}
                  highlighted={state.status === "llama_selection"}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Footer Area */}
        <View style={styles.footer}>
          <View style={styles.woodenBenchContainer}>
            <Bench cards={state.board} maxSlots={difficultyConfig.benchSize} />
            <Text style={styles.benchLabel}>Bancada (Max {difficultyConfig.benchSize})</Text>
          </View>

          <View style={styles.meterContainer}>
            <LlamaMeter
              points={state.llamaMeter}
              maxPoints={difficultyConfig.goalPoints}
              onActivate={onActivateLlama}
              isReady={state.llamaMeter >= difficultyConfig.goalPoints && state.status === "playing"}
            />
          </View>
        </View>

        <GameOverlay status={state.status} onRestart={onRestart} />
        {showStampede && (
          <LlamaStampede onComplete={() => setShowStampede(false)} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#b8ff9e", // Grass green
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  header: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  recordButton: {
    position: "absolute",
    left: 90,
    top: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  recordButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  timerContainer: {
    position: "absolute",
    right: 10,
    top: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  headerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  instructionContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  avatarBadge: {
    position: "absolute",
    top: -5,
    backgroundColor: "#ffd700",
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#333",
  },
  llamaInstruction: {
    marginTop: 10,
    color: "#9c27b0",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tableArea: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tableInner: {
    width: 320,
    height: 380,
    position: "relative",
  },
  cardWrapper: {
    position: "absolute",
  },
  footer: {
    paddingBottom: 5,
    alignItems: "center",
    width: "100%",
  },
  woodenBenchContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: "#8b4513", // SaddleBrown
    borderRadius: 15,
    borderWidth: 4,
    borderColor: "#5d2906",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  benchLabel: {
    position: "absolute",
    bottom: -5,
    right: 20,
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  meterContainer: {
    width: "100%",
    marginTop: 15,
  },
});
