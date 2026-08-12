import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_SETTINGS, SETTINGS_KEY } from './defaults';

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(SETTINGS_KEY)
      .then((raw) => {
        if (!active) return;
        if (!raw) {
          setReady(true);
          return;
        }
        try {
          const parsed = JSON.parse(raw);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        } catch {
          // keep defaults
        }
        setReady(true);
      })
      .catch(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const update = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const rememberName = useCallback((name) => {
    const trimmed = name.trim().slice(0, 16);
    if (!trimmed) return;
    setSettings((prev) => {
      const knownNames = [trimmed, ...prev.knownNames.filter((n) => n !== trimmed)].slice(0, 8);
      const next = { ...prev, playerName: trimmed, knownNames };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return { settings, ready, update, rememberName };
}
