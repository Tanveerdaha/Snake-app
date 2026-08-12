import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getDifficulty } from './difficulty';
import { CHAMPION_KEY, STORAGE_KEY } from '../settings/defaults';
import { EVENTS, STATUS, createGame, queueTurn, step, tickInterval } from './engine';

const buzz = (run) => {
  run().catch(() => {});
};

/**
 * Owns the game loop. The authoritative state lives in a ref so that turning
 * the snake never reschedules the tick timer; a snapshot is copied into React
 * state once per change purely to drive rendering.
 */
export function useSnakeGame({ stageId, difficultyId, onEvent } = {}) {
  const stageIdRef = useRef(stageId ?? 'classic');
  const difficultyRef = useRef(getDifficulty(difficultyId));
  const onEventRef = useRef(onEvent);
  stageIdRef.current = stageId ?? 'classic';
  difficultyRef.current = getDifficulty(difficultyId);
  onEventRef.current = onEvent;

  const gameRef = useRef(null);
  if (gameRef.current === null) gameRef.current = createGame(stageIdRef.current);

  const [game, setGame] = useState(gameRef.current);
  const [best, setBest] = useState(0);
  const [beatBest, setBeatBest] = useState(false);
  const [champion, setChampion] = useState(null);
  const [pendingChampion, setPendingChampion] = useState(null);

  const bestRef = useRef(0);
  const timerRef = useRef(null);

  const publish = useCallback(() => setGame({ ...gameRef.current }), []);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    Promise.all([AsyncStorage.getItem(STORAGE_KEY), AsyncStorage.getItem(CHAMPION_KEY)])
      .then(([stored, champRaw]) => {
        if (!active) return;
        const value = Number(stored);
        if (Number.isFinite(value) && value > 0) {
          bestRef.current = value;
          setBest(value);
        }
        if (champRaw) {
          try {
            setChampion(JSON.parse(champRaw));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Preview the selected stage on the ready board when settings change.
  useEffect(() => {
    if (gameRef.current.status !== STATUS.ready) return;
    gameRef.current = createGame(stageId);
    publish();
  }, [stageId, publish]);

  const recordBest = useCallback((score) => {
    if (score <= bestRef.current) {
      setBeatBest(false);
      return false;
    }
    bestRef.current = score;
    setBest(score);
    setBeatBest(true);
    AsyncStorage.setItem(STORAGE_KEY, String(score)).catch(() => {});
    setPendingChampion({ score });
    return true;
  }, []);

  const saveChampion = useCallback(async (name, score) => {
    const trimmed = (name || 'Player').trim().slice(0, 16) || 'Player';
    const next = { name: trimmed, score };
    setChampion(next);
    setPendingChampion(null);
    await AsyncStorage.setItem(CHAMPION_KEY, JSON.stringify(next)).catch(() => {});
    return next;
  }, []);

  const dismissChampionPrompt = useCallback(() => {
    setPendingChampion(null);
  }, []);

  const runTick = useCallback(() => {
    const { game: next, event } = step(gameRef.current);
    gameRef.current = next;
    publish();
    onEventRef.current?.(event, next);

    if (event === EVENTS.ate) {
      buzz(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
    }

    if (next.status === STATUS.over) {
      buzz(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
      recordBest(next.score);
      return;
    }

    if (next.status === STATUS.won) {
      buzz(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
      recordBest(next.score);
      return;
    }

    timerRef.current = setTimeout(runTick, tickInterval(next.score, difficultyRef.current));
  }, [publish, recordBest]);

  const start = useCallback(() => {
    stopTimer();
    setBeatBest(false);
    setPendingChampion(null);
    gameRef.current = { ...createGame(stageIdRef.current), status: STATUS.running };
    publish();
    onEventRef.current?.('start', gameRef.current);
    timerRef.current = setTimeout(runTick, tickInterval(0, difficultyRef.current));
  }, [publish, runTick, stopTimer]);

  const togglePause = useCallback(() => {
    const current = gameRef.current;

    if (current.status === STATUS.running) {
      stopTimer();
      gameRef.current = { ...current, status: STATUS.paused };
      publish();
      return;
    }

    if (current.status === STATUS.paused) {
      gameRef.current = { ...current, status: STATUS.running };
      publish();
      timerRef.current = setTimeout(runTick, tickInterval(current.score, difficultyRef.current));
    }
  }, [publish, runTick, stopTimer]);

  const turn = useCallback(
    (direction) => {
      if (gameRef.current.status !== STATUS.running) return;
      gameRef.current = queueTurn(gameRef.current, direction);
      publish();
    },
    [publish]
  );

  useEffect(() => stopTimer, [stopTimer]);

  return {
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
  };
}
