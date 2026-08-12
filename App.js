import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useGameAudio } from './src/audio/useGameAudio';
import Board from './src/components/Board';
import Button from './src/components/Button';
import DPad from './src/components/DPad';
import HighScoreModal from './src/components/HighScoreModal';
import Hud from './src/components/Hud';
import Overlay from './src/components/Overlay';
import SettingsIcon from './src/components/SettingsIcon';
import SettingsModal from './src/components/SettingsModal';
import { COLS, SWIPE_THRESHOLD } from './src/game/constants';
import { getDifficulty } from './src/game/difficulty';
import { DIRECTIONS, EVENTS, STATUS } from './src/game/engine';
import { getStage } from './src/game/stages';
import { useSnakeGame } from './src/game/useSnakeGame';
import { useSettings } from './src/settings/useSettings';
import { COLORS } from './src/theme';

// Vertical space taken by the title, HUD, D-pad and padding.
const CHROME_HEIGHT = 400;

function overlayFor(game, beatBest, champion) {
  const stageName = getStage(game.stageId).name;

  switch (game.status) {
    case STATUS.ready:
      return {
        title: 'Snake',
        message: `${stageName} stage. Swipe the board or use the pad to steer.`,
        actionLabel: 'Play',
      };
    case STATUS.paused:
      return { title: 'Paused', message: 'Take your time.', actionLabel: 'Resume' };
    case STATUS.over:
      return {
        title: 'Game Over',
        message: beatBest
          ? `New best — ${game.score} points!`
          : `You hit ${game.cause === 'wall' ? 'a wall' : 'yourself'}. Final score: ${game.score}.`,
        actionLabel: 'Play Again',
        tone: 'danger',
        showChampion: Boolean(champion?.name) && !beatBest,
      };
    case STATUS.won:
      return {
        title: 'Board Cleared',
        message: `You filled every cell with ${game.score} points. Nothing left to eat.`,
        actionLabel: 'Play Again',
      };
    default:
      return null;
  }
}

function Game() {
  const { width, height } = useWindowDimensions();
  const { settings, update, rememberName } = useSettings();
  const { playSfx } = useGameAudio(settings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const onEvent = useCallback(
    (event) => {
      if (event === 'start') playSfx('start');
      else if (event === EVENTS.ate) playSfx('eat');
      else if (event === EVENTS.dead) playSfx('die');
      else if (event === EVENTS.won) playSfx('start');
    },
    [playSfx]
  );

  const {
    game,
    best,
    beatBest,
    champion,
    pendingChampion,
    saveChampion,
    dismissChampionPrompt,
    start,
    togglePause,
    turn,
  } = useSnakeGame({
    stageId: settings.stageId,
    difficultyId: settings.difficultyId,
    onEvent,
  });

  const boardSize = useMemo(() => {
    const limit = Math.max(160, Math.min(width - 32, height - CHROME_HEIGHT));
    return Math.floor(limit / COLS) * COLS;
  }, [width, height]);

  const anchor = useRef({ x: 0, y: 0 });

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_event, gesture) =>
          Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6,
        onPanResponderGrant: () => {
          anchor.current = { x: 0, y: 0 };
        },
        onPanResponderMove: (_event, gesture) => {
          const dx = gesture.dx - anchor.current.x;
          const dy = gesture.dy - anchor.current.y;
          if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

          if (Math.abs(dx) > Math.abs(dy)) {
            turn(dx > 0 ? DIRECTIONS.right : DIRECTIONS.left);
          } else {
            turn(dy > 0 ? DIRECTIONS.down : DIRECTIONS.up);
          }
          anchor.current = { x: gesture.dx, y: gesture.dy };
        },
      }),
    [turn]
  );

  const overlay = overlayFor(game, beatBest, champion);
  const running = game.status === STATUS.running;
  const paused = game.status === STATUS.paused;
  const difficulty = getDifficulty(settings.difficultyId);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>SNAKE</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={() => setSettingsOpen(true)}
          style={({ pressed }) => [styles.settingsBtn, pressed && styles.settingsPressed]}
        >
          <SettingsIcon />
        </Pressable>
      </View>

      <Hud score={game.score} best={best} length={game.body.length} champion={champion} />

      <Text style={styles.meta}>
        {getStage(settings.stageId).name} · {difficulty.name}
      </Text>

      <View style={[styles.boardWrap, { width: boardSize, height: boardSize }]}>
        <Board game={game} size={boardSize} responderProps={pan.panHandlers} />
        {overlay !== null && (
          <Overlay
            title={overlay.title}
            message={overlay.message}
            actionLabel={overlay.actionLabel}
            tone={overlay.tone}
            onAction={paused ? togglePause : start}
          >
            {overlay.showChampion && champion ? (
              <Text style={styles.championNote}>
                High score dealer: {champion.name} ({champion.score})
              </Text>
            ) : null}
          </Overlay>
        )}
      </View>

      <DPad onTurn={turn} disabled={!running} />

      <Button
        label={paused ? 'Resume' : 'Pause'}
        variant="ghost"
        onPress={togglePause}
        disabled={!running && !paused}
      />

      <SettingsModal
        visible={settingsOpen}
        settings={settings}
        onChange={update}
        onClose={() => setSettingsOpen(false)}
      />

      <HighScoreModal
        visible={pendingChampion !== null}
        score={pendingChampion?.score ?? 0}
        knownNames={settings.knownNames}
        defaultName={settings.playerName}
        onSave={async (name) => {
          rememberName(name);
          await saveChampion(name, pendingChampion.score);
        }}
        onSkip={dismissChampionPrompt}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <Game />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bgDeep,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 6,
    color: COLORS.accent,
  },
  settingsBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panelSolid,
  },
  settingsPressed: {
    opacity: 0.75,
  },
  meta: {
    fontSize: 12,
    color: COLORS.muted,
    letterSpacing: 0.4,
  },
  boardWrap: {
    position: 'relative',
    zIndex: 2,
  },
  championNote: {
    marginBottom: 16,
    fontSize: 13,
    color: COLORS.accentDim,
    textAlign: 'center',
  },
});
